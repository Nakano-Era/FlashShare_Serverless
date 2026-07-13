document.addEventListener('DOMContentLoaded', () => {
  // --- 狀態管理 ---
  let activeTab = 'send'; // 'send' 或 'receive'
  let activeShareType = 'file'; // 'file' 或 'text'
  let selectedFile = null;
  let isLoggedIn = false;
  let currentUser = '';
  let CONFIGURED_DOMAIN = ''; // 後端設定的自定義網域
  let SYSTEM_PORT = null; // 後端執行的實際監聽端口

  // 全域變數掛載在 window 上，讓 i18n 翻譯器讀取
  window.MAX_FILE_SIZE_MB = 100; 

  // --- DOM 元素獲取 ---
  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabSend = document.getElementById('tab-send');
  const tabReceive = document.getElementById('tab-receive');

  // Share Type Switcher
  const typeBtns = document.querySelectorAll('.type-btn');
  const fileShareZone = document.getElementById('file-share-zone');
  const textShareZone = document.getElementById('text-share-zone');

  // File Upload
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const fileInfoCard = document.getElementById('file-info-card');
  const selectedFileName = document.getElementById('selected-file-name');
  const selectedFileSize = document.getElementById('selected-file-size');
  const removeFileBtn = document.getElementById('remove-file-btn');

  // Text Upload
  const textInput = document.getElementById('text-input');
  const charCountNum = document.getElementById('char-count-num');

  // Expiry Dropdown
  const shareExpiry = document.getElementById('share-expiry');
  const expiryNeverOption = document.getElementById('expiry-never-option');
  const permanentQuotaDisplay = document.getElementById('permanent-quota-display');

  // Advanced Privacy Checkboxes
  const chkPrivacyMode = document.getElementById('chk-privacy-mode');
  const chkNoPasswordContainer = document.getElementById('chk-no-password-container');
  const chkNoPassword = document.getElementById('chk-no-password');
  const chkSameAccountContainer = document.getElementById('chk-same-account-container');
  const chkSameAccount = document.getElementById('chk-same-account');

  // Progress Bar
  const uploadProgressContainer = document.getElementById('upload-progress-container');
  const progressStatus = document.getElementById('progress-status');
  const progressPercent = document.getElementById('progress-percent');
  const progressBarFill = document.getElementById('progress-bar-fill');

  // Action Buttons
  const submitShareBtn = document.getElementById('submit-share-btn');
  const submitBtnText = document.getElementById('submit-btn-text');

  // Result Card (Send Success)
  const shareResultCard = document.getElementById('share-result-card');
  const resultCode = document.getElementById('result-code');
  const resultPassword = document.getElementById('result-password');
  const resultDirectLink = document.getElementById('result-direct-link');
  const copyCodeBtn = document.getElementById('copy-code-btn');
  const copyPwdBtn = document.getElementById('copy-pwd-btn');
  const copyDirectLinkBtn = document.getElementById('copy-direct-link-btn');
  const copyAllBtn = document.getElementById('copy-all-btn');
  const resetShareBtn = document.getElementById('reset-share-btn');

  // Retrieve Form
  const retrieveCode = document.getElementById('retrieve-code');
  const retrievePassword = document.getElementById('retrieve-password');
  const submitRetrieveBtn = document.getElementById('submit-retrieve-btn');
  const resetRetrieveBtn = document.getElementById('reset-retrieve-btn');

  // Retrieve Result Card
  const retrieveResultCard = document.getElementById('retrieve-result-card');
  const textResultDisplay = document.getElementById('text-result-display');
  const retrievedText = document.getElementById('retrieved-text');
  const copyRetrievedTextBtn = document.getElementById('copy-retrieved-text-btn');
  const textExpiryTime = document.getElementById('text-expiry-time');

  const fileResultDisplay = document.getElementById('file-result-display');
  const retrievedFileName = document.getElementById('retrieved-file-name');
  const retrievedFileSize = document.getElementById('retrieved-file-size');
  const downloadFileBtn = document.getElementById('download-file-btn');
  const fileExpiryTime = document.getElementById('file-expiry-time');

  // --- 會員系統相關 DOM 元素 ---
  const navLoginBtn = document.getElementById('nav-login-btn');
  const navUserMenu = document.getElementById('nav-user-menu');
  const navUsername = document.getElementById('nav-username');
  const userMenuTrigger = document.getElementById('user-menu-trigger');
  const logoutBtn = document.getElementById('logout-btn');
  const navChangePwdBtn = document.getElementById('nav-change-pwd-btn');
  
  // Auth Modal (登入/註冊)
  const authModalOverlay = document.getElementById('auth-modal-overlay');
  const closeAuthBtn = document.getElementById('close-auth-btn');
  const authTabLogin = document.getElementById('auth-tab-login');
  const authTabRegister = document.getElementById('auth-tab-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  const loginUsernameInp = document.getElementById('login-username');
  const loginPasswordInp = document.getElementById('login-password');
  const registerUsernameInp = document.getElementById('register-username');
  const registerPasswordInp = document.getElementById('register-password');
  const registerConfirmPasswordInp = document.getElementById('register-confirm-password');

  // 修改密碼 Modal
  const changePwdModalOverlay = document.getElementById('change-pwd-modal-overlay');
  const closeChangePwdBtn = document.getElementById('close-change-pwd-btn');
  const changePwdForm = document.getElementById('change-pwd-form');
  const changeOldPasswordInp = document.getElementById('change-old-password');
  const changeNewPasswordInp = document.getElementById('change-new-password');
  const changeConfirmPasswordInp = document.getElementById('change-confirm-password');

  // Dashboard 我的分享列表
  const mySharesSection = document.getElementById('my-shares-section');
  const mySharesList = document.getElementById('my-shares-list');

  // 管理員面板 DOM 元素
  const adminPanelSection = document.getElementById('admin-panel-section');
  const adminCreateUserForm = document.getElementById('admin-create-user-form');
  const adminNewUsernameInp = document.getElementById('admin-new-username');
  const adminNewPasswordInp = document.getElementById('admin-new-password');
  const adminNewLimitInp = document.getElementById('admin-new-limit');

  const adminSystemConfigForm = document.getElementById('admin-system-config-form');
  const adminSysDomainInp = document.getElementById('admin-sys-domain');
  const adminSysPortInp = document.getElementById('admin-sys-port');

  // 服務條款與隱私提示 DOM 元素
  const termsTriggerBtn = document.getElementById('terms-trigger-btn');
  const termsModalOverlay = document.getElementById('terms-modal-overlay');
  const closeTermsBtn = document.getElementById('close-terms-btn');
  const termsDynamicBody = document.getElementById('terms-dynamic-body');

  // --- 通用工具函數 ---

  // Toast 訊息提示
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '';
    if (type === 'success') {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // 格式化位元組大小
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // 取得基準 URL (優先採用目前瀏覽器所用的端口，如 8443)
  function getBaseUrl() {
    let base = CONFIGURED_DOMAIN || '';
    if (base) {
      if (!/^https?:\/\//i.test(base)) {
        base = `${window.location.protocol}//${base}`;
      }
      // 檢查網域名稱內是否已包含端口 (避免重複附加)
      const hasPort = /:\d+$/.test(base.replace(/^\w+:\/\//, ''));
      if (!hasPort) {
        // 優先讀取瀏覽器目前的連線端口 (如 8443)；否則回退到系統實際監聽端口 (3000)
        const browserPort = window.location.port;
        if (browserPort && browserPort !== '80' && browserPort !== '443') {
          base = `${base}:${browserPort}`;
        } else if (SYSTEM_PORT && SYSTEM_PORT !== 80 && SYSTEM_PORT !== 443) {
          base = `${base}:${SYSTEM_PORT}`;
        }
      }
    } else {
      base = window.location.origin;
    }
    return base;
  }

  // 複製文字到剪貼簿
  function copyToClipboard(text, btnElement) {
    if (!navigator.clipboard) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        showToast(i18n.t('toast_copy_success'), 'success');
        if (btnElement) triggerCopiedState(btnElement);
      } catch (err) {
        showToast(i18n.t('toast_copy_fail'), 'error');
      }
      document.body.removeChild(textArea);
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      showToast(i18n.t('toast_copy_success'), 'success');
      if (btnElement) triggerCopiedState(btnElement);
    }).catch(err => {
      showToast(i18n.t('toast_copy_fail'), 'error');
    });
  }

  // 複製按鈕狀態切換
  function triggerCopiedState(btn) {
    btn.classList.add('copied');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = originalHTML;
    }, 1500);
  }

  // 格式化時間
  function formatExpiryTime(timestamp) {
    if (!timestamp) return i18n.t('text_never_expires');
    const date = new Date(timestamp);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  }

  // --- 分頁切換 ---
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab === activeTab) return;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (tab === 'send') {
        tabSend.classList.add('active');
        tabReceive.classList.remove('active');
      } else {
        tabReceive.classList.add('active');
        tabSend.classList.remove('active');
      }
      activeTab = tab;
    });
  });

  // --- 分享類型切換 ---
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      if (type === activeShareType) return;

      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (type === 'file') {
        fileShareZone.classList.add('active');
        textShareZone.classList.remove('active');
      } else {
        textShareZone.classList.add('active');
        fileShareZone.classList.remove('active');
      }
      activeShareType = type;
    });
  });

  // --- 文字輸入字數統計 ---
  textInput.addEventListener('input', () => {
    const len = textInput.value.length;
    charCountNum.textContent = len.toLocaleString();
    if (len > 2000000) {
      charCountNum.style.color = 'var(--danger-color)';
    } else {
      charCountNum.style.color = '';
    }
  });

  // --- 拖曳檔案處理 ---
  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('dragover');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  });

  function handleFiles(files) {
    if (files.length === 0) return;
    
    const file = files[0];
    
    // 校驗大小
    if (window.MAX_FILE_SIZE_MB < 1000 * 1024 && file.size > window.MAX_FILE_SIZE_MB * 1024 * 1024) {
      showToast(i18n.t('toast_upload_limit_err'), 'error');
      return;
    }

    selectedFile = file;
    selectedFileName.textContent = file.name;
    selectedFileSize.textContent = formatBytes(file.size);

    dropZone.classList.add('hidden');
    fileInfoCard.classList.remove('hidden');
  }

  // 移除已選檔案
  removeFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetFileInput();
  });

  function resetFileInput() {
    selectedFile = null;
    fileInput.value = '';
    fileInfoCard.classList.add('hidden');
    dropZone.classList.remove('hidden');
  }

  // --- 提交分享內容 ---
  submitShareBtn.addEventListener('click', () => {
    if (activeShareType === 'file') {
      uploadFileShare();
    } else {
      uploadTextShare();
    }
  });

  // 檔案上傳
  function uploadFileShare() {
    if (!selectedFile) {
      showToast(i18n.t('toast_select_file'), 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('expireHours', shareExpiry.value);
    formData.append('isPrivacyMode', chkPrivacyMode.checked);
    formData.append('noPassword', chkNoPassword.checked);
    formData.append('noCodeAndPwd', chkSameAccount.checked);

    setShareControlsDisabled(true);
    uploadProgressContainer.classList.remove('hidden');
    progressStatus.textContent = '...';
    progressPercent.textContent = '0%';
    progressBarFill.style.width = '0%';

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/share/file', true);

    const token = localStorage.getItem('auth_token');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        progressPercent.textContent = `${percent}%`;
        progressBarFill.style.width = `${percent}%`;
        progressStatus.textContent = 'Uploading...';
      }
    });

    xhr.onload = function () {
      setShareControlsDisabled(false);
      uploadProgressContainer.classList.add('hidden');

      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            showToast(i18n.t('toast_upload_success'), 'success');
            showShareResult(response.share);
            if (isLoggedIn) fetchUserShares();
          } else {
            showToast(response.error || 'Upload error', 'error');
          }
        } catch (e) {
          showToast('JSON Parse Error', 'error');
        }
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          showToast(res.error || 'Server error', 'error');
        } catch(err) {
          showToast('HTTP Error', 'error');
        }
      }
    };

    xhr.onerror = function () {
      setShareControlsDisabled(false);
      uploadProgressContainer.classList.add('hidden');
      showToast('Network error', 'error');
    };

    xhr.send(formData);
  }

  // 文字上傳
  function uploadTextShare() {
    const text = textInput.value;
    if (!text || text.trim() === '') {
      showToast(i18n.t('toast_text_empty'), 'error');
      return;
    }

    setShareControlsDisabled(true);
    submitBtnText.textContent = '...';

    const token = localStorage.getItem('auth_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch('/api/share/text', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        text,
        expireHours: shareExpiry.value,
        isPrivacyMode: chkPrivacyMode.checked,
        noPassword: chkNoPassword.checked,
        noCodeAndPwd: chkSameAccount.checked
      })
    })
    .then(res => res.json())
    .then(data => {
      setShareControlsDisabled(false);
      submitBtnText.textContent = i18n.t('btn_generate');

      if (data.success) {
        showToast(i18n.t('toast_text_success'), 'success');
        showShareResult(data.share);
        if (isLoggedIn) fetchUserShares();
      } else {
        showToast(data.error || 'Error', 'error');
      }
    })
    .catch(err => {
      setShareControlsDisabled(false);
      submitBtnText.textContent = i18n.t('btn_generate');
      showToast('Network error', 'error');
    });
  }

  function setShareControlsDisabled(disabled) {
    submitShareBtn.disabled = disabled;
    typeBtns.forEach(btn => btn.disabled = disabled);
    tabBtns.forEach(btn => btn.disabled = disabled);
    textInput.disabled = disabled;
    removeFileBtn.disabled = disabled;
    dropZone.style.pointerEvents = disabled ? 'none' : 'auto';
  }

  // 顯示分享成功畫面
  function showShareResult(share) {
    fileShareZone.classList.add('hidden');
    textShareZone.classList.add('hidden');
    submitShareBtn.classList.add('hidden');
    document.querySelector('.type-switcher').classList.add('hidden');
    document.getElementById('expiry-group').classList.add('hidden');
    document.getElementById('privacy-options-group').classList.add('hidden');

    const codeRow = document.getElementById('result-code-row');
    const pwdRow = document.getElementById('result-pwd-row');
    const linkRow = document.getElementById('result-link-row');
    const sameAccountRow = document.getElementById('result-same-account-row');

    if (share.sameAccountOnly) {
      codeRow.classList.add('hidden');
      pwdRow.classList.add('hidden');
      linkRow.classList.add('hidden');
      copyAllBtn.classList.add('hidden');
      sameAccountRow.classList.remove('hidden');
    } else {
      sameAccountRow.classList.add('hidden');
      codeRow.classList.remove('hidden');
      linkRow.classList.remove('hidden');
      copyAllBtn.classList.remove('hidden');

      // 格式化提取碼 (包含英數字混合與數字)
      const formattedCode = share.code.length === 6 
        ? share.code.replace(/(.{3})(.{3})/, '$1 $2')
        : share.code;
      resultCode.textContent = formattedCode;

      let directLink = '';
      if (!share.password) {
        pwdRow.classList.add('hidden');
        directLink = `${getBaseUrl()}/s/${share.code}`;
      } else {
        pwdRow.classList.remove('hidden');
        resultPassword.textContent = share.password;
        directLink = `${getBaseUrl()}/s/${share.code}/${share.password}`;
      }
      
      resultDirectLink.value = directLink;

      copyCodeBtn.onclick = () => copyToClipboard(share.code, copyCodeBtn);
      if (share.password) {
        copyPwdBtn.onclick = () => copyToClipboard(share.password, copyPwdBtn);
      }
      copyDirectLinkBtn.onclick = () => copyToClipboard(directLink, copyDirectLinkBtn);
      
      // 多語系一鍵完整提取訊息
      const expiryText = share.expiresAt 
        ? i18n.t('text_expires_at', { time: formatExpiryTime(share.expiresAt) })
        : i18n.t('text_never_expires');

      let fullInfo = `【${i18n.t('nav_title')}】\n` +
                     `⚡ ${i18n.t('result_link_label')}：\n${directLink}\n\n` +
                     `(${i18n.t('receive_code_label')}: ${share.code}`;
      if (share.password) {
        fullInfo += ` | ${i18n.t('receive_pwd_label')}: ${share.password}`;
      }
      fullInfo += `)\n📅 ${expiryText}`;

      copyAllBtn.onclick = () => copyToClipboard(fullInfo, copyAllBtn);
    }

    shareResultCard.classList.remove('hidden');
  }

  // 重置分享表單
  resetShareBtn.addEventListener('click', () => {
    shareResultCard.classList.add('hidden');
    document.querySelector('.type-switcher').classList.remove('hidden');
    document.getElementById('expiry-group').classList.remove('hidden');
    document.getElementById('privacy-options-group').classList.remove('hidden');
    submitShareBtn.classList.remove('hidden');
    
    // 重置隱私選項勾選框與可用狀態
    chkPrivacyMode.checked = false;
    chkNoPassword.checked = false;
    chkSameAccount.checked = false;

    chkPrivacyMode.disabled = false;
    chkNoPassword.disabled = false;

    if (shareExpiry.value === '0.0833') {
      chkNoPasswordContainer.classList.remove('hidden');
    } else {
      chkNoPasswordContainer.classList.add('hidden');
    }

    if (isLoggedIn) {
      chkSameAccountContainer.classList.remove('hidden');
    } else {
      chkSameAccountContainer.classList.add('hidden');
    }
    
    if (activeShareType === 'file') {
      fileShareZone.classList.remove('hidden');
      resetFileInput();
    } else {
      textShareZone.classList.remove('hidden');
      textInput.value = '';
      charCountNum.textContent = '0';
    }
  });


  // --- 提取分享內容 ---
  
  retrieveCode.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9-]/g, '').substring(0, 36);
  });

  retrievePassword.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4);
  });

  submitRetrieveBtn.addEventListener('click', () => {
    const code = retrieveCode.value.trim();
    const password = retrievePassword.value.trim();

    if (code.length < 6) {
      showToast(i18n.t('toast_code_len_err'), 'error');
      retrieveCode.focus();
      return;
    }

    submitRetrieveBtn.disabled = true;
    submitRetrieveBtn.textContent = '...';

    // 1. 先呼叫 info 取得分享的元資料，確認是否需要密碼
    const token = localStorage.getItem('auth_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/retrieve/info', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ code })
    })
    .then(res => res.json())
    .then(infoData => {
      if (!infoData.success) {
        submitRetrieveBtn.disabled = false;
        submitRetrieveBtn.textContent = i18n.t('btn_retrieve');
        showToast(infoData.error || i18n.t('密碼或提取碼有誤或文件過期'), 'error');
        return;
      }

      // 如果密碼不存在，則代表免密碼
      const hasPassword = !!infoData.share.password;

      if (hasPassword && password.length !== 4) {
        submitRetrieveBtn.disabled = false;
        submitRetrieveBtn.textContent = i18n.t('btn_retrieve');
        showToast(i18n.t('toast_pwd_len_err'), 'error');
        retrievePassword.focus();
        return;
      }

      // 2. 驗證密碼並提取內容
      fetch('/api/retrieve/data', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ code, password: hasPassword ? password : '' })
      })
      .then(res => res.json())
      .then(data => {
        submitRetrieveBtn.disabled = false;
        submitRetrieveBtn.textContent = i18n.t('btn_retrieve');

        if (data.success) {
          showToast(i18n.t('toast_retrieve_success'), 'success');
          showRetrieveResult(data, infoData.share);
        } else {
          showToast(data.error || 'Retrieve failed', 'error');
        }
      })
      .catch(err => {
        submitRetrieveBtn.disabled = false;
        submitRetrieveBtn.textContent = i18n.t('btn_retrieve');
        showToast('Network error', 'error');
      });
    })
    .catch(err => {
      submitRetrieveBtn.disabled = false;
      submitRetrieveBtn.textContent = i18n.t('btn_retrieve');
      showToast('Network error', 'error');
    });
  });

  function showRetrieveResult(res, shareInfo = null) {
    document.querySelectorAll('#tab-receive .form-group').forEach(el => el.classList.add('hidden'));
    submitRetrieveBtn.classList.add('hidden');
    retrieveResultCard.classList.remove('hidden');

    const updateExpiryText = (el, info) => {
      el.textContent = info.expiresAt 
        ? i18n.t('text_expires_at', { time: formatExpiryTime(info.expiresAt) })
        : i18n.t('text_never_expires');
    };

    if (res.type === 'text') {
      textResultDisplay.classList.remove('hidden');
      fileResultDisplay.classList.add('hidden');
      retrievedText.value = res.text;
      
      if (shareInfo) {
        updateExpiryText(textExpiryTime, shareInfo);
      } else {
        fetch('/api/retrieve/info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: retrieveCode.value.trim() })
        })
        .then(r => r.json())
        .then(infoData => {
          if (infoData.success) {
            updateExpiryText(textExpiryTime, infoData.share);
          }
        });
      }

      copyRetrievedTextBtn.onclick = () => copyToClipboard(res.text, copyRetrievedTextBtn);
    } else {
      fileResultDisplay.classList.remove('hidden');
      textResultDisplay.classList.add('hidden');

      retrievedFileName.textContent = res.filename;
      retrievedFileSize.textContent = `Size: ${formatBytes(res.fileSize)}`;
      downloadFileBtn.href = res.downloadUrl;

      if (shareInfo) {
        updateExpiryText(fileExpiryTime, shareInfo);
      } else {
        fetch('/api/retrieve/info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: retrieveCode.value.trim() })
        })
        .then(r => r.json())
        .then(infoData => {
          if (infoData.success) {
            updateExpiryText(fileExpiryTime, infoData.share);
          }
        });
      }
    }
  }

  // 重置提取表單
  resetRetrieveBtn.addEventListener('click', () => {
    retrieveResultCard.classList.add('hidden');
    textResultDisplay.classList.add('hidden');
    fileResultDisplay.classList.add('hidden');

    document.querySelectorAll('#tab-receive .form-group').forEach(el => el.classList.remove('hidden'));
    submitRetrieveBtn.classList.remove('hidden');

    retrieveCode.value = '';
    retrievePassword.value = '';
    retrievedText.value = '';
    
    if (window.location.pathname.startsWith('/s/')) {
      window.history.replaceState({}, document.title, '/');
    }
  });


  // ==========================================================================
  // 會員管理與儀表板系統邏輯
  // ==========================================================================

  // --- Modal 開關管理 ---
  navLoginBtn.addEventListener('click', () => {
    authModalOverlay.classList.remove('hidden');
    loginUsernameInp.focus();
  });

  closeAuthBtn.addEventListener('click', () => {
    authModalOverlay.classList.add('hidden');
    resetAuthFormInputs();
  });

  authModalOverlay.addEventListener('click', (e) => {
    if (e.target === authModalOverlay) {
      authModalOverlay.classList.add('hidden');
      resetAuthFormInputs();
    }
  });

  function resetAuthFormInputs() {
    loginForm.reset();
    registerForm.reset();
  }

  // 點擊 Modal 中的 Tabs (登入與註冊切換)
  authTabLogin.addEventListener('click', () => {
    authTabLogin.classList.add('active');
    authTabRegister.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
  });

  authTabRegister.addEventListener('click', () => {
    authTabRegister.classList.add('active');
    authTabLogin.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
  });

  // --- 服務條款與隱私提示 Modal 開關 ---
  if (termsTriggerBtn) {
    termsTriggerBtn.addEventListener('click', () => {
      // 根據當前語系，載入對應的條款內容
      const currentLang = i18n.getCurrentLanguage();
      if (termsDynamicBody && i18n.termsContent && i18n.termsContent[currentLang]) {
        termsDynamicBody.innerHTML = i18n.termsContent[currentLang];
      }
      termsModalOverlay.classList.remove('hidden');
    });
  }

  if (closeTermsBtn) {
    closeTermsBtn.addEventListener('click', () => {
      termsModalOverlay.classList.add('hidden');
    });
  }

  if (termsModalOverlay) {
    termsModalOverlay.addEventListener('click', (e) => {
      if (e.target === termsModalOverlay) {
        termsModalOverlay.classList.add('hidden');
      }
    });
  }

  // --- 使用者下拉選單開關 ---
  userMenuTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    navUserMenu.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    navUserMenu.classList.remove('active');
  });

  // --- 登入表單提交 ---
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = loginUsernameInp.value.trim();
    const password = loginPasswordInp.value;

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('auth_token', data.token);
        setLoggedInState(true, data.username, data.role);
        authModalOverlay.classList.add('hidden');
        resetAuthFormInputs();
        showToast(i18n.t('toast_login_success'), 'success');
      } else {
        showToast(data.error || 'Login Error', 'error');
      }
    })
    .catch(err => {
      showToast('Connection failed', 'error');
    });
  });

  // --- 註冊表單提交 ---
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = registerUsernameInp.value.trim();
    const password = registerPasswordInp.value;
    const confirmPassword = registerConfirmPasswordInp.value;

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      registerConfirmPasswordInp.focus();
      return;
    }

    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showToast(i18n.t('toast_register_success'), 'success');
        authTabLogin.click();
        loginUsernameInp.value = username;
        loginPasswordInp.focus();
        registerForm.reset();
      } else {
        showToast(data.error || 'Registration failed', 'error');
      }
    })
    .catch(err => {
      showToast('Connection failed', 'error');
    });
  });

  // --- 登出帳號 ---
  logoutBtn.addEventListener('click', () => {
    const token = localStorage.getItem('auth_token');
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .finally(() => {
      localStorage.removeItem('auth_token');
      setLoggedInState(false);
      showToast(i18n.t('toast_logout_success'), 'info');
    });
  });


  // --- 修改密碼事件與表單處理 ---
  if (navChangePwdBtn) {
    navChangePwdBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navUserMenu.classList.remove('active');
      changePwdModalOverlay.classList.remove('hidden');
      changeOldPasswordInp.focus();
    });
  }

  if (closeChangePwdBtn) {
    closeChangePwdBtn.addEventListener('click', () => {
      changePwdModalOverlay.classList.add('hidden');
      changePwdForm.reset();
    });
  }

  if (changePwdModalOverlay) {
    changePwdModalOverlay.addEventListener('click', (e) => {
      if (e.target === changePwdModalOverlay) {
        changePwdModalOverlay.classList.add('hidden');
        changePwdForm.reset();
      }
    });
  }

  if (changePwdForm) {
    changePwdForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const oldPassword = changeOldPasswordInp.value;
      const newPassword = changeNewPasswordInp.value;
      const confirmPassword = changeConfirmPasswordInp.value;

      if (newPassword !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        changeConfirmPasswordInp.focus();
        return;
      }

      const token = localStorage.getItem('auth_token');
      fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showToast(i18n.t('toast_change_pwd_success'), 'success');
          changePwdModalOverlay.classList.add('hidden');
          changePwdForm.reset();
        } else {
          showToast(data.error || 'Error', 'error');
        }
      })
      .catch(err => {
        showToast('Connection failed', 'error');
      });
    });
  }


  // --- 管理員面板建立帳號事件處理 ---
  if (adminCreateUserForm) {
    adminCreateUserForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = adminNewUsernameInp.value.trim();
      const password = adminNewPasswordInp.value;
      const maxUploadSizeGb = adminNewLimitInp.value;

      const token = localStorage.getItem('auth_token');
      fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, password, maxUploadSizeGb })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showToast(i18n.t('toast_create_user_success'), 'success');
          adminCreateUserForm.reset();
          adminNewLimitInp.value = 1;
        } else {
          showToast(data.error || 'Error', 'error');
        }
      })
      .catch(err => {
        showToast('Connection failed', 'error');
      });
    });
  }


  // --- 管理員系統設定 (域名與端口) 事件處理 ---
  if (adminSystemConfigForm) {
    adminSystemConfigForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const domain = adminSysDomainInp.value.trim();
      const port = adminSysPortInp.value.trim();

      const token = localStorage.getItem('auth_token');
      fetch('/api/admin/system-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ domain, port })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.portChanged) {
            showToast(i18n.t('toast_port_change_redirect'), 'success');
            setTimeout(() => {
              const targetDomain = domain || window.location.hostname;
              const newUrl = `${window.location.protocol}//${targetDomain}:${data.newPort}`;
              window.location.href = newUrl;
            }, 3000);
          } else {
            showToast(i18n.t('toast_save_config_success'), 'success');
            fetchSystemConfigDetails();
          }
        } else {
          showToast(data.error || 'Error', 'error');
        }
      })
      .catch(err => {
        showToast('Connection failed', 'error');
      });
    });
  }

  // 管理員拉取系統詳細設定
  function fetchSystemConfigDetails() {
    const token = localStorage.getItem('auth_token');
    fetch('/api/admin/system-config', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.config) {
        adminSysDomainInp.value = data.config.domain || '';
        adminSysPortInp.value = data.config.port || '';
      }
    })
    .catch(err => console.error('Error fetching config:', err));
  }

  // 管理員拉取系統日誌
  function fetchSystemLogs() {
    const token = localStorage.getItem('auth_token');
    fetch('/api/admin/logs', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.logs) {
        renderSystemLogs(data.logs);
      }
    })
    .catch(err => console.error('Error fetching logs:', err));
  }

  // 渲染日誌內容到表格
  function renderSystemLogs(logs) {
    const tbody = document.getElementById('admin-logs-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (logs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: var(--text-muted); padding: 24px;">${i18n.t('log_empty')}</td></tr>`;
      return;
    }

    logs.forEach(log => {
      const tr = document.createElement('tr');
      const timeStr = new Date(log.timestamp).toLocaleString();
      const actionBadge = log.action === 'file_upload' ? 'file_upload' : 'text_upload';
      const actionText = log.action === 'file_upload' ? i18n.t('log_action_file') : i18n.t('log_action_text');

      // 替換日誌內文的前綴以匹配對應語系
      let displayDetails = log.details;
      if (log.action === 'file_upload') {
        displayDetails = log.details.replace(/^上傳檔案:/, i18n.t('log_action_file') + ':');
      } else if (log.action === 'text_upload') {
        displayDetails = log.details.replace(/^分享文字:/, i18n.t('log_action_text') + ':');
      }

      tr.innerHTML = `
        <td style="color: var(--text-muted); font-size: 0.85rem;">${timeStr}</td>
        <td style="font-weight: 500;">${log.username}</td>
        <td><span class="log-action-badge ${actionBadge}">${actionText}</span></td>
        <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${displayDetails}">${displayDetails}</td>
        <td style="color: var(--accent-cyan); font-family: monospace;">${log.ip || 'Unknown'}</td>
      `;
      tbody.appendChild(tr);
    });
  }


  // --- 登入狀態渲染更新 ---
  function setLoggedInState(loggedIn, username = '', role = 'user') {
    isLoggedIn = loggedIn;
    currentUser = username;

    if (loggedIn) {
      navLoginBtn.classList.add('hidden');
      navUserMenu.classList.remove('hidden');
      navUsername.textContent = username;
      mySharesSection.classList.remove('hidden');
      chkSameAccountContainer.classList.remove('hidden');
      fetchUserShares();
      
      // 啟用過期時間設定的「不過期」選項
      expiryNeverOption.disabled = false;
      expiryNeverOption.textContent = i18n.t('expiry_never');

      if (role === 'admin') {
        adminPanelSection.classList.remove('hidden');
        fetchSystemConfigDetails();
        fetchSystemLogs();
      } else {
        adminPanelSection.classList.add('hidden');
      }
    } else {
      navUserMenu.classList.add('hidden');
      navLoginBtn.classList.remove('hidden');
      mySharesSection.classList.add('hidden');
      adminPanelSection.classList.add('hidden');
      mySharesList.innerHTML = '';
      
      // 隱藏並重置「限同帳號下載」
      chkSameAccountContainer.classList.add('hidden');
      chkSameAccount.checked = false;
      chkPrivacyMode.disabled = false;
      chkNoPassword.disabled = false;

      // 訪客停用「不過期」選項
      expiryNeverOption.disabled = true;
      expiryNeverOption.textContent = i18n.t('expiry_never_guest');
      if (shareExpiry.value === 'never') {
        shareExpiry.value = '24';
      }
    }
    // 重新載入對應等級的系統大小設定與空間配額
    fetchSystemConfig();
  }

  // --- 獲取個人分享清單 ---
  function fetchUserShares() {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    fetch('/api/user/shares', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (res.status === 401) {
        localStorage.removeItem('auth_token');
        setLoggedInState(false);
        return null;
      }
      return res.json();
    })
    .then(data => {
      if (!data || !data.success) return;
      renderUserShares(data.shares);
      
      // 同步更新日誌列表 (如果管理員面板正開啟著)
      if (adminPanelSection && !adminPanelSection.classList.contains('hidden')) {
        fetchSystemLogs();
      }
    })
    .catch(err => console.error('Failed to fetch user shares:', err));
  }

  // --- 渲染個人分享清單 ---
  function renderUserShares(shares) {
    mySharesList.innerHTML = '';

    if (shares.length === 0) {
      mySharesList.innerHTML = `<div class="shares-list-empty">${i18n.t('dashboard_empty')}</div>`;
      return;
    }

    shares.forEach(item => {
      const card = document.createElement('div');
      card.className = 'share-item-card';

      const typeIcon = item.type === 'file' 
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;

      const displayName = item.type === 'file' ? item.payload : item.payload.substring(0, 30) + (item.payload.length > 30 ? '...' : '');
      const displaySize = item.type === 'file' ? ` (${formatBytes(item.fileSize)})` : '';
      
      const expiryText = item.expiresAt 
        ? i18n.t('text_expires_at', { time: formatExpiryTime(item.expiresAt) })
        : i18n.t('text_never_expires');

      let metaHtml = '';
      if (item.sameAccountOnly) {
        metaHtml = `<span><strong class="highlight-cyan">${i18n.t('result_same_account_only')}</strong></span>`;
      } else if (!item.password) {
        metaHtml = `<span>${i18n.t('receive_code_label')}: <strong class="highlight-cyan monospace">${item.code}</strong></span>`;
      } else {
        metaHtml = `<span>${i18n.t('receive_code_label')}: <strong class="highlight-cyan monospace">${item.code}</strong></span>
                    <span>${i18n.t('receive_pwd_label')}: <strong class="highlight-cyan monospace">${item.password}</strong></span>`;
      }

      card.innerHTML = `
        <div class="share-item-type ${item.type}">
          ${typeIcon}
        </div>
        <div class="share-item-info">
          <div class="share-item-name" title="${item.type === 'file' ? item.payload : ''}">${displayName}${displaySize}</div>
          <div class="share-item-meta">
            ${metaHtml}
          </div>
          <div class="share-item-expiry">${expiryText}</div>
        </div>
        <div class="share-item-actions">
        </div>
      `;

      const actionsDiv = card.querySelector('.share-item-actions');

      if (!item.sameAccountOnly) {
        const shareUrlBtn = document.createElement('button');
        shareUrlBtn.title = 'Copy Link';
        shareUrlBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
        `;
        shareUrlBtn.onclick = () => {
          const directLink = item.password
            ? `${getBaseUrl()}/s/${item.code}/${item.password}`
            : `${getBaseUrl()}/s/${item.code}`;
          const shareText = `【${i18n.t('nav_title')}】\n${i18n.t('result_link_label')}：\n${directLink}`;
          copyToClipboard(shareText, shareUrlBtn);
        };
        actionsDiv.appendChild(shareUrlBtn);
      }

      if (item.type === 'file') {
        const downloadBtn = document.createElement('a');
        downloadBtn.title = 'Download';
        if (item.sameAccountOnly) {
          downloadBtn.href = `/api/download/${item.code}?token=${encodeURIComponent(localStorage.getItem('auth_token') || '')}`;
        } else {
          downloadBtn.href = `/api/download/${item.code}${item.password ? `?password=${encodeURIComponent(item.password)}` : ''}`;
        }
        downloadBtn.setAttribute('download', '');
        downloadBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        `;
        actionsDiv.appendChild(downloadBtn);
      } else {
        const copyTextBtn = document.createElement('button');
        copyTextBtn.title = 'Copy';
        copyTextBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        `;
        copyTextBtn.onclick = () => {
          copyToClipboard(item.payload, copyTextBtn);
        };
        actionsDiv.appendChild(copyTextBtn);
      }

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-action-btn';
      deleteBtn.title = 'Delete';
      deleteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      `;
      deleteBtn.onclick = () => {
        if (confirm(i18n.t('toast_delete_confirm'))) {
          deleteShareFromServer(item.code);
        }
      };
      actionsDiv.appendChild(deleteBtn);

      mySharesList.appendChild(card);
    });
  }

  // --- 向伺服器發送提前銷毀請求 ---
  function deleteShareFromServer(code) {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    fetch(`/api/share/${code}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showToast(i18n.t('toast_delete_success'), 'success');
        fetchUserShares();
        fetchSystemConfig(); // 刷新配額剩餘額度
      } else {
        showToast(data.error || 'Delete failed', 'error');
      }
    })
    .catch(err => {
      showToast('Connection failed', 'error');
    });
  }

  // --- 獲取對應身分的系統設定與永久額度 ---
  function fetchSystemConfig() {
    const token = localStorage.getItem('auth_token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/config', { headers })
      .then(res => res.json())
      .then(data => {
        if (data) {
          CONFIGURED_DOMAIN = data.domain || '';
          SYSTEM_PORT = data.port || null;
          
          if (data.maxFileSizeMb) {
            window.MAX_FILE_SIZE_MB = data.maxFileSizeMb;
            
            // 更新上傳提示文字
            const fileLimitText = document.getElementById('file-limit-text');
            if (fileLimitText) {
              const limitMb = window.MAX_FILE_SIZE_MB;
              let limitStr = '';
              if (limitMb >= 1000 * 1024) {
                limitStr = i18n.t('text_unlimited');
              } else if (limitMb >= 1024) {
                limitStr = `${(limitMb / 1024).toFixed(1)}GB`;
              } else {
                limitStr = `${limitMb}MB`;
              }
              fileLimitText.innerHTML = i18n.t('upload_subtitle', { limit: limitStr });
            }

            const maxDisplay = document.getElementById('max-size-display');
            if (maxDisplay) {
              if (window.MAX_FILE_SIZE_MB >= 1000 * 1024) {
                maxDisplay.textContent = i18n.t('text_unlimited');
              } else if (window.MAX_FILE_SIZE_MB >= 1024) {
                maxDisplay.textContent = `${(window.MAX_FILE_SIZE_MB / 1024).toFixed(1)}GB`;
              } else {
                maxDisplay.textContent = `${window.MAX_FILE_SIZE_MB}MB`;
              }
            }
          }

          // 渲染永久儲存空間使用進度
          if (data.permanentStorageLimit !== undefined) {
            if (data.permanentStorageLimit === 0) {
              permanentQuotaDisplay.classList.add('hidden');
            } else {
              permanentQuotaDisplay.classList.remove('hidden');
              if (data.permanentStorageLimit === -1) {
                permanentQuotaDisplay.textContent = `${i18n.t('dashboard_quota')}: ${i18n.t('text_unlimited')}`;
              } else {
                const usedStr = formatBytes(data.permanentStorageUsed || 0, 1);
                const limitStr = formatBytes(data.permanentStorageLimit, 0);
                permanentQuotaDisplay.textContent = `${i18n.t('dashboard_quota')}: ${usedStr} / ${limitStr}`;
              }
            }
          }
        }
      })
      .catch(err => console.error('Error fetching config:', err));
  }

  // 監聽銷毀時間變更以顯示或隱藏「不生成密碼」
  shareExpiry.addEventListener('change', () => {
    if (shareExpiry.value === '0.0833') {
      chkNoPasswordContainer.classList.remove('hidden');
    } else {
      chkNoPasswordContainer.classList.add('hidden');
      chkNoPassword.checked = false;
      if (!chkSameAccount.checked) {
        chkPrivacyMode.disabled = false;
      }
    }
  });

  // 監聽「限同帳號下載」勾選狀態
  chkSameAccount.addEventListener('change', () => {
    if (chkSameAccount.checked) {
      // 勾選限同帳號，禁用並取消勾選隱私傳輸與免密碼
      chkPrivacyMode.checked = false;
      chkPrivacyMode.disabled = true;
      chkNoPassword.checked = false;
      chkNoPassword.disabled = true;
    } else {
      chkPrivacyMode.disabled = false;
      if (shareExpiry.value === '0.0833') {
        chkNoPassword.disabled = false;
      }
    }
  });

  // 監聽「不生成提取密碼」勾選狀態
  chkNoPassword.addEventListener('change', () => {
    if (chkNoPassword.checked) {
      showToast(i18n.t('toast_bruteforce_warning'), 'error');
    }
  });

  // --- 初始化與自動提取路徑解析 ---
  function initApp() {
    fetchSystemConfig();

    // 初始化隱私控制組狀態
    if (shareExpiry.value === '0.0833') {
      chkNoPasswordContainer.classList.remove('hidden');
    } else {
      chkNoPasswordContainer.classList.add('hidden');
    }

    const token = localStorage.getItem('auth_token');
    if (token) {
      fetch('/api/auth/me', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('auth_token');
          setLoggedInState(false);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.success) {
          setLoggedInState(true, data.username, data.role);
        }
      })
      .catch(err => {
        console.error('Connection failed, keeping cached login status', err);
      });
    }

    // 解析 URL 一鍵提取路由 (支援英數字、36位UUID以及選填密碼，支援選填結尾斜線)
    const pathMatch = window.location.pathname.match(/^\/s\/([a-zA-Z0-9-]{6,36})(?:\/([a-zA-Z0-9]{4}))?\/?$/);
    if (pathMatch) {
      const code = pathMatch[1].toLowerCase();
      const password = pathMatch[2] ? pathMatch[2] : '';
      
      const receiveTabBtn = document.querySelector('[data-tab="receive"]');
      if (receiveTabBtn) receiveTabBtn.click();

      retrieveCode.value = code;
      retrievePassword.value = password;

      setTimeout(() => {
        submitRetrieveBtn.click();
      }, 500);
    }
  }

  // 監聽語言更換事件，即時重繪個人清單、上傳上限與永久儲存額度
  document.addEventListener('languagechanged', () => {
    if (isLoggedIn) {
      fetchUserShares();
    }
    // 重新取得並更新系統字串與大小限制提示
    fetchSystemConfig();
  });

  // 啟動初始化
  initApp();
});
