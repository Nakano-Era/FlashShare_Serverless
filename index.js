// Cloudflare Worker Router (index.js)
// Runs serverless on Cloudflare Edge Network

// Web Crypto PBKDF2 Hashing
async function hashPassword(password, saltHex) {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
  
  const salt = saltHex 
    ? hexToBytes(saltHex) 
    : crypto.getRandomValues(new Uint8Array(16));
    
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    passwordKey,
    256
  );
  
  return {
    hash: bytesToHex(new Uint8Array(derivedBits)),
    salt: bytesToHex(salt)
  };
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// 產生隨機的分享碼與密碼
async function generateUniqueCode(env, isPrivacyMode = false, sameAccountOnly = false) {
  if (sameAccountOnly) {
    return crypto.randomUUID();
  }
  
  let attempts = 0;
  const chars = '23456789abcdefghjklmnpqrstuvwxyz';
  while (attempts < 1000) {
    let code = '';
    if (isPrivacyMode) {
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } else {
      code = Math.floor(100000 + Math.random() * 900000).toString();
    }
    
    const existing = await env.DB.get(`share:${code.toLowerCase()}`);
    if (!existing) {
      return code.toLowerCase();
    }
    attempts++;
  }
  throw new Error('無法生成唯一的分享碼，請稍後再試。');
}

function generateRandomPassword(isPrivacyMode = false) {
  const chars = isPrivacyMode ? '23456789abcdefghjklmnpqrstuvwxyz' : '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let password = '';
  for (let i = 0; i < 4; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password.toLowerCase();
}

// Database Helpers targeting Cloudflare KV & R2
const db = {
  async getSession(env, token) {
    const sessionStr = await env.DB.get(`session:${token}`);
    if (!sessionStr) return null;
    return JSON.parse(sessionStr);
  },

  async createSession(env, user) {
    const token = crypto.randomUUID().replace(/-/g, '');
    const session = {
      userId: user.id,
      username: user.username,
      role: user.role || 'user',
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };
    await env.DB.put(`session:${token}`, JSON.stringify(session), { expirationTtl: 604800 });
    return token;
  },

  async destroySession(env, token) {
    await env.DB.delete(`session:${token}`);
  },

  async getUserById(env, userId) {
    const userStr = await env.DB.get(`user:${userId}`);
    if (!userStr) return null;
    return JSON.parse(userStr);
  },

  async getUserByUsername(env, username) {
    const userId = await env.DB.get(`username:${username.toLowerCase()}`);
    if (!userId) return null;
    return this.getUserById(env, userId);
  },

  async createUser(env, username, password, role = 'user', maxUploadSizeGb = null) {
    const normalizedUser = username.trim().toLowerCase();
    const existingId = await env.DB.get(`username:${normalizedUser}`);
    if (existingId) {
      return { success: false, error: '該使用者名稱已被註冊。' };
    }

    const userId = crypto.randomUUID();
    const { hash, salt } = await hashPassword(password);

    const user = {
      id: userId,
      username: username.trim(),
      passwordHash: hash,
      salt,
      role,
      maxUploadSizeGb: maxUploadSizeGb ? parseFloat(maxUploadSizeGb) : null,
      createdAt: Date.now()
    };

    await env.DB.put(`user:${userId}`, JSON.stringify(user));
    await env.DB.put(`username:${normalizedUser}`, userId);
    return { success: true, userId };
  },

  async changeUserPassword(env, userId, oldPassword, newPassword) {
    const user = await this.getUserById(env, userId);
    if (!user) return { success: false, error: '使用者不存在。' };

    const { hash: checkHash } = await hashPassword(oldPassword, user.salt);
    if (checkHash !== user.passwordHash) {
      return { success: false, error: '舊密碼輸入錯誤。' };
    }

    const { hash, salt } = await hashPassword(newPassword);
    user.passwordHash = hash;
    user.salt = salt;

    await env.DB.put(`user:${userId}`, JSON.stringify(user));
    return { success: true };
  },

  async getSystemConfig(env) {
    const configStr = await env.DB.get('config');
    if (!configStr) {
      return { domain: '', port: null };
    }
    return JSON.parse(configStr);
  },

  async updateSystemConfig(env, domain, port) {
    const config = {
      domain: domain ? domain.trim() : '',
      port: port ? parseInt(port, 10) : null
    };
    await env.DB.put('config', JSON.stringify(config));
    return config;
  },

  async createShare(env, { type, payload, filename = null, fileSize = null, userId = null, expireHours = 24, isPrivacyMode = false, noCodeAndPwd = false, noPassword = false }) {
    const code = await generateUniqueCode(env, isPrivacyMode, noCodeAndPwd);
    const password = (noCodeAndPwd || noPassword) ? null : generateRandomPassword(isPrivacyMode);
    const now = Date.now();
    const expiresAt = expireHours === null ? null : now + expireHours * 60 * 60 * 1000;

    const record = {
      code,
      password,
      type,
      payload,
      filename,
      fileSize,
      userId,
      createdAt: now,
      expiresAt,
      sameAccountOnly: noCodeAndPwd ? true : undefined
    };

    const options = {};
    if (expireHours !== null) {
      const ttlSeconds = Math.max(60, Math.ceil(expireHours * 60 * 60));
      options.expirationTtl = ttlSeconds;
    }

    await env.DB.put(`share:${code}`, JSON.stringify(record), options);

    return {
      code,
      password,
      type,
      payload: type === 'file' ? payload : undefined,
      expiresAt,
      sameAccountOnly: record.sameAccountOnly
    };
  },

  async getShareInfo(env, code) {
    const recordStr = await env.DB.get(`share:${code.toLowerCase()}`);
    if (!recordStr) return null;
    const share = JSON.parse(recordStr);

    // 檢查是否已過期，若過期則執行物理銷毀 (刪除 R2 檔案與 KV 元數據)
    if (share.expiresAt !== null && Date.now() > share.expiresAt) {
      if (share.type === 'file' && share.payload) {
        try {
          await env.STORAGE.delete(share.payload);
        } catch (err) {
          console.error('Failed to delete expired R2 object on access:', err);
        }
      }
      await env.DB.delete(`share:${code.toLowerCase()}`);
      return null;
    }
    return share;
  },

  async deleteShare(env, code) {
    const share = await this.getShareInfo(env, code);
    if (!share) return false;

    if (share.type === 'file' && share.payload) {
      try {
        await env.STORAGE.delete(share.payload);
      } catch (err) {
        console.error('Failed to delete R2 object:', err);
      }
    }

    await env.DB.delete(`share:${code.toLowerCase()}`);
    return true;
  },

  async addLog(env, userId, username, action, details, ip) {
    const timestamp = Date.now();
    const id = crypto.randomUUID();
    const log = { id, userId, username, action, details, ip, timestamp };
    await env.DB.put(`log:${timestamp}:${id}`, JSON.stringify(log), { expirationTtl: 2592000 });
  },

  async getLogs(env) {
    const list = await env.DB.list({ prefix: 'log:' });
    const logs = [];
    for (const key of list.keys) {
      const logStr = await env.DB.get(key.name);
      if (logStr) {
        logs.push(JSON.parse(logStr));
      }
    }
    return logs.sort((a, b) => b.timestamp - a.timestamp);
  },

  async getUserPermanentStorageSize(env, userId) {
    const list = await env.DB.list({ prefix: 'share:' });
    let totalSize = 0;
    for (const key of list.keys) {
      const shareStr = await env.DB.get(key.name);
      if (shareStr) {
        const share = JSON.parse(shareStr);
        if (share.userId === userId && share.expiresAt === null && share.type === 'file') {
          totalSize += (share.fileSize || 0);
        }
      }
    }
    return totalSize;
  },

  async getUserShares(env, userId) {
    const list = await env.DB.list({ prefix: 'share:' });
    const shares = [];
    for (const key of list.keys) {
      const shareStr = await env.DB.get(key.name);
      if (shareStr) {
        const share = JSON.parse(shareStr);
        if (share.userId === userId) {
          shares.push({
            code: share.code,
            password: share.password,
            type: share.type,
            payload: share.type === 'file' ? share.filename : share.payload,
            fileSize: share.fileSize,
            createdAt: share.createdAt,
            expiresAt: share.expiresAt,
            sameAccountOnly: share.sameAccountOnly
          });
        }
      }
    }
    return shares.sort((a, b) => b.createdAt - a.createdAt);
  }
};

// 確保管理員帳號存在 (自動 Seeding)
async function checkAndSeedAdmin(env) {
  const adminId = await env.DB.get('username:admin');
  if (!adminId) {
    await db.createUser(env, 'admin', 'admin_flash_2026', 'admin');
  }
}

// 輔助函式：JSON 回應
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

// 輔助函式：取得用戶真實 IP
function getClientIp(request) {
  return request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || '127.0.0.1';
}

// API 路由分發器
async function handleApi(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;
  const ip = getClientIp(request);

  // 1. 會員認證中間件
  const authUser = await getAuthenticatedUser(request, env);

  // 1.1 會員註冊
  if (pathname === '/api/auth/register' && method === 'POST') {
    try {
      const { username, password } = await request.json();
      if (!username || !password) {
        return jsonResponse({ success: false, error: '請提供使用者名稱與密碼。' }, 400);
      }
      const result = await db.createUser(env, username, password, 'user');
      if (result.success) {
        return jsonResponse({ success: true, message: '註冊成功！' });
      } else {
        return jsonResponse({ success: false, error: result.error }, 400);
      }
    } catch (e) {
      return jsonResponse({ success: false, error: e.message }, 500);
    }
  }

  // 1.2 會員登入
  if (pathname === '/api/auth/login' && method === 'POST') {
    try {
      const { username, password } = await request.json();
      const user = await db.getUserByUsername(env, username);
      if (!user) {
        return jsonResponse({ success: false, error: '使用者名稱或密碼錯誤。' }, 400);
      }
      const { hash: checkHash } = await hashPassword(password, user.salt);
      if (checkHash !== user.passwordHash) {
        return jsonResponse({ success: false, error: '使用者名稱或密碼錯誤。' }, 400);
      }
      const token = await db.createSession(env, user);
      return jsonResponse({ success: true, token, username: user.username, role: user.role || 'user' });
    } catch (e) {
      return jsonResponse({ success: false, error: e.message }, 500);
    }
  }

  // 1.3 取得目前會員狀態
  if (pathname === '/api/auth/me' && method === 'GET') {
    if (!authUser) return jsonResponse({ success: false, error: '未登入。' }, 401);
    return jsonResponse({ success: true, username: authUser.username, role: authUser.role });
  }

  // 1.4 會員登出
  if (pathname === '/api/auth/logout' && method === 'POST') {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await db.destroySession(env, token);
    }
    return jsonResponse({ success: true });
  }

  // 1.5 修改密碼
  if (pathname === '/api/user/change-password' && method === 'POST') {
    if (!authUser) return jsonResponse({ success: false, error: '未授權。' }, 401);
    try {
      const { oldPassword, newPassword } = await request.json();
      const result = await db.changeUserPassword(env, authUser.userId, oldPassword, newPassword);
      if (result.success) {
        return jsonResponse({ success: true, message: '密碼修改成功。' });
      } else {
        return jsonResponse({ success: false, error: result.error }, 400);
      }
    } catch (e) {
      return jsonResponse({ success: false, error: e.message }, 500);
    }
  }

  // 2. 獲取分享列表 (限登入)
  if (pathname === '/api/user/shares' && method === 'GET') {
    if (!authUser) return jsonResponse({ success: false, error: '未授權。' }, 401);
    const shares = await db.getUserShares(env, authUser.userId);
    return jsonResponse({ success: true, shares });
  }

  // 3. 上傳檔案 (支援 R2 串流與大小限制)
  if (pathname === '/api/share/file' && method === 'POST') {
    try {
      let maxSizeBytes = 20 * 1024 * 1024; // 訪客限制 20MB
      if (authUser) {
        const user = await db.getUserById(env, authUser.userId);
        if (user) {
          if (user.role === 'admin') {
            maxSizeBytes = 1000 * 1024 * 1024 * 1024; // 管理員 1TB
          } else if (user.maxUploadSizeGb) {
            maxSizeBytes = user.maxUploadSizeGb * 1024 * 1024 * 1024;
          } else {
            maxSizeBytes = 100 * 1024 * 1024; // 普通會員 100MB
          }
        }
      }

      const formData = await request.formData();
      const file = formData.get('file');
      const expireHoursVal = formData.get('expireHours');
      const isPrivacyMode = formData.get('isPrivacyMode') === 'true';
      const noCodeAndPwd = formData.get('noCodeAndPwd') === 'true';
      const noPassword = formData.get('noPassword') === 'true';

      if (!file) return jsonResponse({ success: false, error: '未選擇檔案。' }, 400);
      if (file.size > maxSizeBytes) {
        return jsonResponse({ success: false, error: `上傳失敗：超出檔案大小上限。` }, 400);
      }

      let expireHours = parseFloat(expireHoursVal);
      if (isNaN(expireHours)) expireHours = 24;

      if (!authUser && (expireHoursVal === '0' || expireHoursVal === 'never' || isNaN(expireHours))) {
        return jsonResponse({ success: false, error: '訪客不允許上傳永久檔案。' }, 403);
      }
      
      const targetExpireHours = (expireHoursVal === '0' || expireHoursVal === 'never') ? null : expireHours;

      if (noCodeAndPwd && !authUser) {
        return jsonResponse({ success: false, error: '此功能僅限登入會員使用。' }, 403);
      }

      const r2Key = `uploads/${Date.now()}-${crypto.randomUUID()}`;
      await env.STORAGE.put(r2Key, file.stream(), {
        customMetadata: {
          filename: file.name,
          contentType: file.type || 'application/octet-stream'
        }
      });

      const share = await db.createShare(env, {
        type: 'file',
        payload: r2Key,
        filename: file.name,
        fileSize: file.size,
        userId: authUser ? authUser.userId : null,
        expireHours: targetExpireHours,
        isPrivacyMode,
        noCodeAndPwd,
        noPassword
      });

      const sizeStr = file.size >= 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        : (file.size / 1024).toFixed(2) + ' KB';
      await db.addLog(
        env,
        authUser ? authUser.userId : null,
        authUser ? authUser.username : 'Guest',
        'file_upload',
        `上傳檔案: ${file.name} (${sizeStr})`,
        ip
      );

      return jsonResponse({ success: true, share });
    } catch (e) {
      return jsonResponse({ success: false, error: e.message }, 500);
    }
  }

  // 4. 上傳文字
  if (pathname === '/api/share/text' && method === 'POST') {
    try {
      const { text, expireHours: expireHoursVal, isPrivacyMode, noCodeAndPwd, noPassword } = await request.json();
      if (!text || text.trim() === '') {
        return jsonResponse({ success: false, error: '文字內容不能為空。' }, 400);
      }
      if (text.length > 2 * 1024 * 1024) {
        return jsonResponse({ success: false, error: '文字超出 2MB 大小限制。' }, 400);
      }

      let expireHours = parseFloat(expireHoursVal);
      if (isNaN(expireHours)) expireHours = 24;

      if (!authUser && (expireHoursVal === '0' || expireHoursVal === 'never' || isNaN(expireHours))) {
        return jsonResponse({ success: false, error: '訪客不允許建立永久文字分享。' }, 403);
      }

      const targetExpireHours = (expireHoursVal === '0' || expireHoursVal === 'never') ? null : expireHours;

      if (noCodeAndPwd && !authUser) {
        return jsonResponse({ success: false, error: '此功能僅限登入會員使用。' }, 403);
      }

      const share = await db.createShare(env, {
        type: 'text',
        payload: text,
        userId: authUser ? authUser.userId : null,
        expireHours: targetExpireHours,
        isPrivacyMode,
        noCodeAndPwd,
        noPassword
      });

      const snippet = text.length > 30 ? text.substring(0, 30) + '...' : text;
      await db.addLog(
        env,
        authUser ? authUser.userId : null,
        authUser ? authUser.username : 'Guest',
        'text_upload',
        `分享文字: ${snippet}`,
        ip
      );

      return jsonResponse({ success: true, share });
    } catch (e) {
      return jsonResponse({ success: false, error: e.message }, 500);
    }
  }

  // 5. 獲取分享基本資訊 (支援同帳號權限校驗與防爆破統一報錯)
  if (pathname === '/api/retrieve/info' && method === 'POST') {
    try {
      const { code } = await request.json();
      const unifiedError = '密碼或提取碼有誤或文件過期';
      if (!code || typeof code !== 'string') {
        return jsonResponse({ success: false, error: unifiedError }, 400);
      }

      const share = await db.getShareInfo(env, code.trim().toLowerCase());
      if (!share) {
        return jsonResponse({ success: false, error: unifiedError }, 404);
      }

      if (share.sameAccountOnly) {
        if (!authUser || authUser.userId !== share.userId) {
          return jsonResponse({ success: false, error: unifiedError }, 403);
        }
      }

      return jsonResponse({ success: true, share });
    } catch (e) {
      return jsonResponse({ success: false, error: e.message }, 500);
    }
  }

  // 6. 驗證密碼並提取內容 (支援限同帳號下載與防爆破統一報錯)
  if (pathname === '/api/retrieve/data' && method === 'POST') {
    try {
      const { code, password } = await request.json();
      const unifiedError = '密碼或提取碼有誤或文件過期';
      if (!code) {
        return jsonResponse({ success: false, error: unifiedError }, 400);
      }

      const share = await db.getShareInfo(env, code.trim().toLowerCase());
      if (!share) {
        return jsonResponse({ success: false, error: unifiedError }, 404);
      }

      if (share.sameAccountOnly) {
        if (!authUser || authUser.userId !== share.userId) {
          return jsonResponse({ success: false, error: unifiedError }, 403);
        }
      }

      if (share.password !== null) {
        const inputPwd = (password || '').trim().toLowerCase();
        const correctPwd = share.password.toLowerCase();
        if (inputPwd !== correctPwd) {
          return jsonResponse({ success: false, error: unifiedError }, 403);
        }
      }

      if (share.type === 'text') {
        return jsonResponse({ success: true, type: 'text', text: share.payload });
      } else {
        return jsonResponse({
          success: true,
          type: 'file',
          filename: share.filename,
          fileSize: share.fileSize,
          downloadUrl: `/api/share/download/${share.code}${share.password ? '?pwd=' + share.password : ''}`
        });
      }
    } catch (e) {
      return jsonResponse({ success: false, error: e.message }, 500);
    }
  }

  // 7. 檔案下載 (串流 R2 檔案)
  if (pathname.startsWith('/api/share/download/')) {
    const code = pathname.substring(20).toLowerCase();
    const share = await db.getShareInfo(env, code);
    if (!share || share.type !== 'file') {
      return jsonResponse({ success: false, error: '密碼或提取碼有誤或文件過期' }, 404);
    }

    if (share.sameAccountOnly) {
      if (!authUser || authUser.userId !== share.userId) {
        return jsonResponse({ success: false, error: '密碼或提取碼有誤或文件過期' }, 403);
      }
    }

    if (share.password !== null) {
      const urlParams = new URL(request.url).searchParams;
      const urlPwd = (urlParams.get('pwd') || '').trim().toLowerCase();
      const correctPwd = share.password.toLowerCase();
      if (urlPwd !== correctPwd) {
        return jsonResponse({ success: false, error: '密碼或提取碼有誤或文件過期' }, 400);
      }
    }

    const object = await env.STORAGE.get(share.payload);
    if (!object) {
      return jsonResponse({ success: false, error: '儲存空間中找不到該檔案！' }, 404);
    }

    return new Response(object.body, {
      headers: {
        'Content-Type': object.customMetadata.contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(share.filename)}`,
        'Content-Length': share.fileSize.toString()
      }
    });
  }

  // 8. 提前銷毀分享項目
  if (pathname.startsWith('/api/share/') && method === 'DELETE') {
    const code = pathname.split('/')[3].toLowerCase();
    const share = await db.getShareInfo(env, code);
    if (!share) return jsonResponse({ success: false, error: '找不到該分享項目。' }, 404);

    const isOwner = authUser && authUser.userId === share.userId;
    const isAdmin = authUser && authUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      return jsonResponse({ success: false, error: '您無權銷毀此分享項目。' }, 403);
    }

    await db.deleteShare(env, code);
    return jsonResponse({ success: true, message: '分享項目已成功銷毀。' });
  }

  // 9. 系統配置獲取
  if (pathname === '/api/config' && method === 'GET') {
    let limitMb = 20;
    let permanentStorageUsed = 0;
    let permanentStorageLimit = 0;

    if (authUser) {
      const user = await db.getUserById(env, authUser.userId);
      if (user) {
        if (user.role === 'admin') {
          limitMb = 1000 * 1024;
          permanentStorageLimit = -1;
        } else if (user.maxUploadSizeGb) {
          limitMb = user.maxUploadSizeGb * 1024;
          permanentStorageLimit = 100 * 1024 * 1024;
        } else {
          limitMb = 100;
          permanentStorageLimit = 100 * 1024 * 1024;
        }
        permanentStorageUsed = await db.getUserPermanentStorageSize(env, user.id);
      }
    }

    const sysConfig = await db.getSystemConfig(env);
    return jsonResponse({
      maxFileSizeMb: limitMb,
      domain: sysConfig.domain || '',
      port: 443,
      permanentStorageLimit,
      permanentStorageUsed
    });
  }

  // 10. 管理員專用：建立自訂使用者
  if (pathname === '/api/admin/create-user' && method === 'POST') {
    if (!authUser || authUser.role !== 'admin') {
      return jsonResponse({ success: false, error: '未授權。' }, 403);
    }
    try {
      const { username, password, maxUploadSizeGb } = await request.json();
      const result = await db.createUser(env, username, password, 'user', maxUploadSizeGb);
      if (result.success) {
        return jsonResponse({ success: true });
      } else {
        return jsonResponse({ success: false, error: result.error }, 400);
      }
    } catch (e) {
      return jsonResponse({ success: false, error: e.message }, 500);
    }
  }

  // 11. 管理員專用：獲取與變更系統設定
  if (pathname === '/api/admin/system-config' && method === 'GET') {
    if (!authUser || authUser.role !== 'admin') {
      return jsonResponse({ success: false, error: '未授權。' }, 403);
    }
    const config = await db.getSystemConfig(env);
    return jsonResponse({ success: true, config });
  }

  if (pathname === '/api/admin/system-config' && method === 'POST') {
    if (!authUser || authUser.role !== 'admin') {
      return jsonResponse({ success: false, error: '未授權。' }, 403);
    }
    try {
      const { domain, port } = await request.json();
      await db.updateSystemConfig(env, domain, port);
      return jsonResponse({ success: true, portChanged: false, newPort: 443 });
    } catch (e) {
      return jsonResponse({ success: false, error: e.message }, 500);
    }
  }

  // 12. 管理員專用：獲取系統日誌
  if (pathname === '/api/admin/logs' && method === 'GET') {
    if (!authUser || authUser.role !== 'admin') {
      return jsonResponse({ success: false, error: '未授權。' }, 403);
    }
    const logs = await db.getLogs(env);
    return jsonResponse({ success: true, logs });
  }

  return jsonResponse({ success: false, error: 'Endpoint not found' }, 404);
}

// 輔助：獲取目前認證用戶
async function getAuthenticatedUser(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  return await db.getSession(env, token);
}

// 獨立的定期清理函數 (用於 Cron 觸發)
async function cleanupExpiredShares(env) {
  const list = await env.DB.list({ prefix: 'share:' });
  const now = Date.now();
  let sharesCleaned = 0;
  for (const key of list.keys) {
    const shareStr = await env.DB.get(key.name);
    if (shareStr) {
      const share = JSON.parse(shareStr);
      if (share.expiresAt !== null && now > share.expiresAt) {
        if (share.type === 'file' && share.payload) {
          try {
            await env.STORAGE.delete(share.payload);
          } catch (err) {
            console.error('[Cron] Failed to delete expired R2 object:', err);
          }
        }
        await env.DB.delete(key.name);
        sharesCleaned++;
      }
    }
  }
  if (sharesCleaned > 0) {
    console.log(`[Cron Cleanup] Automatically destroyed ${sharesCleaned} expired share(s).`);
  }
}

// Cloudflare Worker 進入點
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 自動初始化管理員帳號 (Seeding)
    await checkAndSeedAdmin(env);

    // 1. 處理直接提取路徑 /s/
    if (pathname.startsWith('/s/')) {
      // 重寫路由，引導前端讀取首頁的 SPA 邏輯 (使用 '/' 避免被 Cloudflare Pages 308 重定向到首頁)
      return env.ASSETS.fetch(new Request(url.origin + '/', request));
    }

    // 2. 處理 API 請求
    if (pathname.startsWith('/api/')) {
      return handleApi(request, env);
    }

    // 3. 處理其他靜態檔案 (style.css, app.js, i18n.js 等)
    return env.ASSETS.fetch(request);
  },

  // 支援 Scheduled Cron Trigger 排程任務
  async scheduled(event, env, ctx) {
    ctx.waitUntil(cleanupExpiredShares(env));
  }
};
