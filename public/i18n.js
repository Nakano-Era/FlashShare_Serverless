(function() {
  const translations = {
    "zh-TW": {
      "nav_title": "FlashShare 閃傳",
      "app_subtitle": "極速、安全、臨時傳輸 —— 5分鐘/24小時後自動銷毀，不留痕跡",
      "tab_send": "我要分享",
      "tab_receive": "我要提取",
      "type_file": "文件快傳",
      "type_text": "文字快傳",
      "upload_title": "拖曳檔案至此區域，或 <span class=\"select-link\">點擊瀏覽</span>",
      "upload_subtitle": "支援任意格式檔案，大小限為 {limit}",
      "text_placeholder": "在這裡輸入您想分享的文字或代碼...",
      "expiry_label": "銷毀時間設定",
      "expiry_5m": "5 分鐘後自動銷毀",
      "expiry_24h": "24 小時後自動銷毀",
      "expiry_never": "永久儲存，不過期",
      "expiry_never_guest": "永久儲存，不過期 (需登入會員)",
      "opt_privacy_mode": "隱私傳輸模式 (提取碼與密碼均為英數字混合)",
      "opt_no_password": "不生成提取密碼 (僅使用提取碼)",
      "opt_same_account_only": "限同帳號登入後下載 (不生成密碼與提取碼)",
      "btn_generate": "生成安全分享",
      "result_title": "分享建立成功！",
      "result_code_label": "6位提取碼",
      "result_pwd_label": "4位提取密碼",
      "result_link_label": "一鍵免密碼提取連結",
      "result_same_account_only": "限同帳號下載模式 (無提取碼與密碼)",
      "btn_copy_code": "複製提取碼",
      "btn_copy_pwd": "複製密碼",
      "btn_copy_link": "複製連結",
      "btn_copy_all": "複製一鍵提取整段訊息",
      "btn_share_another": "繼續分享",
      "receive_code_label": "6位提取碼",
      "receive_pwd_label": "4位密碼",
      "receive_code_placeholder": "請輸入 6 位數字或英數字提取碼",
      "receive_pwd_placeholder": "請輸入 4 位數密碼 (若無密碼則免填)",
      "btn_retrieve": "提取安全連結",
      "retrieve_result_title": "安全提取成功！",
      "retrieve_text_title": "已解密提取的文字內容",
      "btn_copy_text": "複製文字內容",
      "btn_download_file": "立即下載文件",
      "btn_retrieve_another": "提取其他分享",
      "dashboard_title": "我的歷史傳輸 (跨設備免密碼同步)",
      "dashboard_quota": "永久檔案空間",
      "dashboard_empty": "您的帳號下目前沒有暫存的分享內容，快去分享一個吧！",
      "admin_title": "系統管理員設置",
      "admin_create_user": "建立自定義權限用戶",
      "admin_username": "使用者名稱",
      "admin_password": "密碼",
      "admin_upload_limit": "最大上傳文件大小限制 (GB)",
      "btn_admin_create": "確認建立用戶",
      "admin_sys_config": "系統網域與端口設定",
      "admin_domain": "自定義域名",
      "admin_domain_placeholder": "例如 share.mydomain.com，不加 http",
      "admin_port": "自定義監聽端口",
      "admin_port_placeholder": "預設為 443，變更後伺服器將重啟",
      "btn_admin_save": "儲存並套用設定",
      "auth_login": "登入",
      "auth_register": "註冊",
      "auth_confirm_pwd": "確認密碼",
      "btn_auth_submit": "確認",
      "change_pwd_title": "修改密碼",
      "change_pwd_old": "舊密碼",
      "change_pwd_new": "新密碼",
      "change_pwd_confirm": "確認新密碼",
      "btn_change_pwd_submit": "確認變更密碼",
      "nav_login": "登入/註冊",
      "nav_logout": "登出",
      "nav_change_pwd": "修改密碼",
      // Toasts & Confirmation messages
      "toast_copy_success": "複製成功！",
      "toast_copy_fail": "複製失敗，請手動複製",
      "toast_select_file": "請先選擇或拖曳一個檔案！",
      "toast_upload_limit_err": "檔案大小超過您的帳號上限！",
      "toast_upload_success": "文件分享已成功建立！",
      "toast_text_empty": "請輸入要分享的文字內容！",
      "toast_text_limit_err": "文字內容過長，限制 2MB 以內",
      "toast_text_success": "文字分享已成功建立！",
      "toast_retrieve_success": "驗證成功，內容已載入！",
      "toast_code_len_err": "請輸入 6 位數分享碼！",
      "toast_pwd_len_err": "請輸入 4 位數密碼！",
      "toast_login_success": "歡迎回來！",
      "toast_register_success": "註冊成功！請在登入頁面登入。",
      "toast_logout_success": "已成功安全登出。",
      "toast_change_pwd_success": "密碼修改成功！",
      "toast_create_user_success": "自定義帳號建立成功！",
      "toast_save_config_success": "設定儲存成功！",
      "toast_port_change_redirect": "端口已變更！伺服器正在重新啟動，我們將在 3 秒後引導您至新端口...",
      "toast_delete_confirm": "您確定要立刻銷毀這個分享項目嗎？\n銷毀後，此內容將從伺服器物理抹除且無法復原。",
      "toast_delete_success": "分享已提前成功銷毀！",
      "toast_bruteforce_warning": "警告：不生成提取密碼會使分享僅受6位提取碼保護，極易被暴力破解！",
      "text_never_expires": "永久有效 (不會過期)",
      "text_expires_at": "將於 {time} 自動銷毀",
      "text_unlimited": "無限制",
      "footer_terms": "服務條款與隱私提示",
      "terms_title": "服務條款與隱私提示",
      "admin_logs_title": "系統操作日誌",
      "log_th_time": "時間",
      "log_th_user": "使用者",
      "log_th_action": "動作",
      "log_th_details": "內容/詳情",
      "log_th_ip": "IP 位址",
      "log_action_file": "檔案上傳",
      "log_action_text": "文字上傳",
      "log_empty": "暫無操作日誌"
    },
    "zh-CN": {
      "nav_title": "FlashShare 闪传",
      "app_subtitle": "极速、安全、临时传输 —— 5分钟/24小时后自动销毁，不留痕迹",
      "tab_send": "我要分享",
      "tab_receive": "我要提取",
      "type_file": "文件快传",
      "type_text": "文字快传",
      "upload_title": "拖拽文件至此区域，或 <span class=\"select-link\">点击浏览</span>",
      "upload_subtitle": "支持任意格式文件，大小限为 {limit}",
      "text_placeholder": "在这里输入您想分享的文字或代码...",
      "expiry_label": "销毁时间设置",
      "expiry_5m": "5 分钟后自动销毁",
      "expiry_24h": "24 小时后自动销毁",
      "expiry_never": "永久储存，不过期",
      "expiry_never_guest": "永久储存，不过期 (需登录会员)",
      "opt_privacy_mode": "隐私传输模式 (提取码与密码均为英数字混合)",
      "opt_no_password": "不生成提取密码 (仅使用提取码)",
      "opt_same_account_only": "限同账号登录后下载 (不生成密码与提取码)",
      "btn_generate": "生成安全分享",
      "result_title": "分享建立成功！",
      "result_code_label": "6位提取码",
      "result_pwd_label": "4位提取密码",
      "result_link_label": "一键免密码提取链接",
      "result_same_account_only": "限同账号下载模式 (无提取码与密码)",
      "btn_copy_code": "复制提取码",
      "btn_copy_pwd": "复制密码",
      "btn_copy_link": "复制链接",
      "btn_copy_all": "复制一键提取整段信息",
      "btn_share_another": "继续分享",
      "receive_code_label": "6位提取码",
      "receive_pwd_label": "4位密码",
      "receive_code_placeholder": "请输入 6 位数字或英数字提取码",
      "receive_pwd_placeholder": "请输入 4 位数密码 (若无密码则免填)",
      "btn_retrieve": "提取安全链接",
      "retrieve_result_title": "安全提取成功！",
      "retrieve_text_title": "已解密提取的文字内容",
      "btn_copy_text": "复制文字内容",
      "btn_download_file": "立即下载文件",
      "btn_retrieve_another": "提取其他分享",
      "dashboard_title": "我的历史传输 (跨设备免密码同步)",
      "dashboard_quota": "永久档案空间",
      "dashboard_empty": "您的账号下目前没有暂存的分享内容，快去分享一个吧！",
      "admin_title": "系统管理员设置",
      "admin_create_user": "建立自定义权限用户",
      "admin_username": "用户名",
      "admin_password": "密码",
      "admin_upload_limit": "最大上传文件大小限制 (GB)",
      "btn_admin_create": "确认建立用户",
      "admin_sys_config": "系统网域与端口设置",
      "admin_domain": "自定义域名",
      "admin_domain_placeholder": "例如 share.mydomain.com，不加 http",
      "admin_port": "自定义监听端口",
      "admin_port_placeholder": "预设为 443，变更后服务器将重启",
      "btn_admin_save": "储存并套用设定",
      "auth_login": "登录",
      "auth_register": "注册",
      "auth_confirm_pwd": "确认密码",
      "btn_auth_submit": "确认",
      "change_pwd_title": "修改密码",
      "change_pwd_old": "旧密码",
      "change_pwd_new": "新密码",
      "change_pwd_confirm": "确认新密码",
      "btn_change_pwd_submit": "确认变更密码",
      "nav_login": "登录/注册",
      "nav_logout": "登出",
      "nav_change_pwd": "修改密码",
      // Toasts & Confirmation messages
      "toast_copy_success": "复制成功！",
      "toast_copy_fail": "复制失败，请手动复制",
      "toast_select_file": "请先选择或拖拽一个文件！",
      "toast_upload_limit_err": "文件大小超过您的账号上限！",
      "toast_upload_success": "文件分享已成功建立！",
      "toast_text_empty": "请输入要分享的文字内容！",
      "toast_text_limit_err": "文字内容过长，限制 2MB 以内",
      "toast_text_success": "文字分享已成功建立！",
      "toast_retrieve_success": "验证成功，内容已载入！",
      "toast_code_len_err": "请输入 6 位数分享码！",
      "toast_pwd_len_err": "请输入 4 位数密码！",
      "toast_login_success": "欢迎回来！",
      "toast_register_success": "注册成功！请在登录页面登录。",
      "toast_logout_success": "已成功安全登出。",
      "toast_change_pwd_success": "密码修改成功！",
      "toast_create_user_success": "自定义账号建立成功！",
      "toast_save_config_success": "设定储存成功！",
      "toast_port_change_redirect": "端口已变更！服务器正在重新启动，我们将在 3 秒后引导您至新端口...",
      "toast_delete_confirm": "您确定要立刻销毁这个分享项目吗？\n销毁后，此内容将从服务器物理抹除且无法复原。",
      "toast_delete_success": "分享已提前成功销毁！",
      "toast_bruteforce_warning": "警告：不生成提取密码会使分享仅受6位提取码保护，极易被暴力破解！",
      "text_never_expires": "永久有效 (不会过期)",
      "text_expires_at": "将于 {time} 自动销毁",
      "text_unlimited": "无限制",
      "footer_terms": "服务条款与隐私提示",
      "terms_title": "服务条款与隐私提示",
      "admin_logs_title": "系统操作日志",
      "log_th_time": "时间",
      "log_th_user": "使用者",
      "log_th_action": "动作",
      "log_th_details": "内容/详情",
      "log_th_ip": "IP 地址",
      "log_action_file": "文件上传",
      "log_action_text": "文字上传",
      "log_empty": "暂无操作日志"
    },
    "en": {
      "nav_title": "FlashShare",
      "app_subtitle": "Fast, secure, temporary transfer — automatically destroyed after 5m/24h",
      "tab_send": "Send",
      "tab_receive": "Receive",
      "type_file": "File Share",
      "type_text": "Text Share",
      "upload_title": "Drag files here, or <span class=\"select-link\">click to browse</span>",
      "upload_subtitle": "Supports any format, max size: {limit}",
      "text_placeholder": "Type or paste your text/code here...",
      "expiry_label": "Self-Destruct Setting",
      "expiry_5m": "Self-destruct in 5 minutes",
      "expiry_24h": "Self-destruct in 24 hours",
      "expiry_never": "Permanent (Never expire)",
      "expiry_never_guest": "Permanent (Never expire, requires login)",
      "opt_privacy_mode": "Privacy Transfer Mode (alphanumeric code & password)",
      "opt_no_password": "Do not generate password (code only)",
      "opt_same_account_only": "Same account only (no code or password)",
      "btn_generate": "Generate Secure Share",
      "result_title": "Share Created Successfully!",
      "result_code_label": "6-Digit Code",
      "result_pwd_label": "4-Digit Password",
      "result_link_label": "One-Click Direct Link",
      "result_same_account_only": "Same Account Only Mode (no code/password)",
      "btn_copy_code": "Copy Code",
      "btn_copy_pwd": "Copy Password",
      "btn_copy_link": "Copy Link",
      "btn_copy_all": "Copy Full Info",
      "btn_share_another": "Share Another",
      "receive_code_label": "6-Digit Code",
      "receive_pwd_label": "4-Digit Password",
      "receive_code_placeholder": "Enter 6-digit retrieval code",
      "receive_pwd_placeholder": "Enter 4-digit password (leave blank if none)",
      "btn_retrieve": "Retrieve Content",
      "retrieve_result_title": "Retrieved Successfully!",
      "retrieve_text_title": "Decrypted Text Content",
      "btn_copy_text": "Copy Text",
      "btn_download_file": "Download File Now",
      "btn_retrieve_another": "Retrieve Another",
      "dashboard_title": "My Transfer History (Passwordless Sync)",
      "dashboard_quota": "Permanent Space",
      "dashboard_empty": "No active shares. Start by sharing a file or text!",
      "admin_title": "System Admin Settings",
      "admin_create_user": "Create Custom User",
      "admin_username": "Username",
      "admin_password": "Password",
      "admin_upload_limit": "Max Upload Size Limit (GB)",
      "btn_admin_create": "Create User",
      "admin_sys_config": "System Domain & Port Configuration",
      "admin_domain": "Custom Domain",
      "admin_domain_placeholder": "e.g. share.mydomain.com (without http)",
      "admin_port": "Custom Port",
      "admin_port_placeholder": "Default 443, server restarts on change",
      "btn_admin_save": "Save & Apply Settings",
      "auth_login": "Login",
      "auth_register": "Register",
      "auth_confirm_pwd": "Confirm Password",
      "btn_auth_submit": "Submit",
      "change_pwd_title": "Change Password",
      "change_pwd_old": "Old Password",
      "change_pwd_new": "New Password",
      "change_pwd_confirm": "Confirm New Password",
      "btn_change_pwd_submit": "Change Password",
      "nav_login": "Login/Register",
      "nav_logout": "Logout",
      "nav_change_pwd": "Change Password",
      // Toasts & Confirmation messages
      "toast_copy_success": "Copied successfully!",
      "toast_copy_fail": "Copy failed, please copy manually",
      "toast_select_file": "Please select or drag a file first!",
      "toast_upload_limit_err": "File size exceeds your account limit!",
      "toast_upload_success": "File share created successfully!",
      "toast_text_empty": "Please enter some text content to share!",
      "toast_text_limit_err": "Text is too long. Limit is 2MB.",
      "toast_text_success": "Text share created successfully!",
      "toast_retrieve_success": "Success! Content loaded.",
      "toast_code_len_err": "Please enter a 6-digit code!",
      "toast_pwd_len_err": "Please enter a 4-digit password!",
      "toast_login_success": "Welcome back!",
      "toast_register_success": "Registration successful! Please login.",
      "toast_logout_success": "Logged out successfully.",
      "toast_change_pwd_success": "Password changed successfully!",
      "toast_create_user_success": "Custom user created successfully!",
      "toast_save_config_success": "Settings saved successfully!",
      "toast_port_change_redirect": "Port changed! Server is restarting, redirecting to the new port in 3s...",
      "toast_delete_confirm": "Are you sure you want to destroy this share immediately?\nThe file/text will be permanently erased from the server.",
      "toast_delete_success": "Share destroyed successfully!",
      "toast_bruteforce_warning": "Warning: Disabling password leaves the file protected only by a 6-digit code, which is highly vulnerable to brute-force guessing!",
      "text_never_expires": "Permanent (Never expire)",
      "text_expires_at": "Expires at {time}",
      "text_unlimited": "Unlimited",
      "footer_terms": "Terms & Privacy",
      "terms_title": "Terms of Service & Privacy Policy",
      "admin_logs_title": "System Operations Log",
      "log_th_time": "Time",
      "log_th_user": "User",
      "log_th_action": "Action",
      "log_th_details": "Details",
      "log_th_ip": "IP Address",
      "log_action_file": "File Upload",
      "log_action_text": "Text Upload",
      "log_empty": "No logs available"
    },
    "ja": {
      "nav_title": "FlashShare",
      "app_subtitle": "高速、安全、一時的な転送 — 5分/24時間後に自動消去",
      "tab_send": "我要分享",
      "tab_receive": "我要提取",
      "type_file": "ファイル送信",
      "type_text": "テキスト送信",
      "upload_title": "ドラッグ＆ドロップするか、<span class=\"select-link\">クリックして選択</span>",
      "upload_subtitle": "任意の形式をサポート、サイズ制限：{limit}",
      "text_placeholder": "ここに共有したいテキストまたはコードを入力...",
      "expiry_label": "自動削除時間設定",
      "expiry_5m": "5分後に自動消去",
      "expiry_24h": "24時間後に自動削除",
      "expiry_never": "永久保存、削除しない",
      "expiry_never_guest": "永久保存、削除しない (会員限定)",
      "opt_privacy_mode": "プライバシー送信モード (英数字のコードとパスワード)",
      "opt_no_password": "パスワードを生成しない (コードのみ)",
      "opt_same_account_only": "同じアカウントのみ (コードとパスワードなし)",
      "btn_generate": "安全な共有を作成",
      "result_title": "共有の作成に成功しました！",
      "result_code_label": "6桁の受取コード",
      "result_pwd_label": "4桁 of 受取パスワード",
      "result_link_label": "ワンクリック直接受取リンク",
      "result_same_account_only": "アカウント限定モード (受取コード・パスワードなし)",
      "btn_copy_code": "コードをコピー",
      "btn_copy_pwd": "パスワードコピー",
      "btn_copy_link": "リンクをコピー",
      "btn_copy_all": "すべての情報をコピー",
      "btn_share_another": "続けて共有する",
      "receive_code_label": "6桁の受取コード",
      "receive_pwd_label": "4桁のパスワード",
      "receive_code_placeholder": "6桁の数字または英数字コードを入力",
      "receive_pwd_placeholder": "4桁のパスワードを入力 (ない場合は空欄)",
      "btn_retrieve": "ファイル/テキストを取得",
      "retrieve_result_title": "受取に成功しました！",
      "retrieve_text_title": "暗号化解除されたテキスト",
      "btn_copy_text": "テキストをコピー",
      "btn_download_file": "ファイルをダウンロード",
      "btn_retrieve_another": "他のファイルを読み込む",
      "dashboard_title": "転送履歴 (パスワード不要同期)",
      "dashboard_quota": "永久保存スペース",
      "dashboard_empty": "現在、転送履歴はありません。ファイルを共有してみましょう！",
      "admin_title": "管理者設定面板",
      "admin_create_user": "カスタム権限ユーザーの作成",
      "admin_username": "ユーザー名",
      "admin_password": "パスワード",
      "admin_upload_limit": "最大アップロードサイズ制限 (GB)",
      "btn_admin_create": "ユーザーを作成",
      "admin_sys_config": "ドメインとポート設定",
      "admin_domain": "カスタムドメイン",
      "admin_domain_placeholder": "例 share.mydomain.com (httpなし)",
      "admin_port": "カスタムポート",
      "admin_port_placeholder": "デフォルトは443、変更後サーバーが再起動します",
      "btn_admin_save": "設定を保存して適用",
      "auth_login": "ログイン",
      "auth_register": "新規登録",
      "auth_confirm_pwd": "パスワード確認",
      "btn_auth_submit": "確認",
      "change_pwd_title": "パスワード変更",
      "change_pwd_old": "現在のパスワード",
      "change_pwd_new": "新しいパスワード",
      "change_pwd_confirm": "新しいパスワード(確認)",
      "btn_change_pwd_submit": "パスワードを変更",
      "nav_login": "ログイン/登録",
      "nav_logout": "ログアウト",
      "nav_change_pwd": "パスワード変更",
      // Toasts & Confirmation messages
      "toast_copy_success": "コピーしました！",
      "toast_copy_fail": "コピーに失敗しました。手動でコピーしてください。",
      "toast_select_file": "まずファイルを選択するか、ドラッグしてください！",
      "toast_upload_limit_err": "ファイルサイズがアカウントの上限を超えています！",
      "toast_upload_success": "ファイル共有を作成しました！",
      "toast_text_empty": "共有するテキストを入力してください！",
      "toast_text_limit_err": "テキストが長すぎます。制限は 2MB です。",
      "toast_text_success": "テキスト共有を作成しました！",
      "toast_retrieve_success": "取得に成功し、コンテンツが読み込まれました！",
      "toast_code_len_err": "6桁のコードを入力してください！",
      "toast_pwd_len_err": "4桁のパスワードを入力してください！",
      "toast_login_success": "おかえりなさい！",
      "toast_register_success": "登録に成功しました！ログインしてください。",
      "toast_logout_success": "ログアウトしました。",
      "toast_change_pwd_success": "パスワードを変更しました！",
      "toast_create_user_success": "カスタムユーザーを作成しました！",
      "toast_save_config_success": "設定を保存しました！",
      "toast_port_change_redirect": "ポートが変更されました！サーバーを再起動します。3秒後に新しいポートにリダイレクトします...",
      "toast_delete_confirm": "この共有ファイルをすぐに削除しますか？\nサーバーから完全に削除され、復元はできません。",
      "toast_delete_success": "正常に削除されました！",
      "toast_bruteforce_warning": "警告: パスワードを生成しないと、ファイルは6桁の受取コードのみで保護され、ブルートフォース攻撃に対して非常に脆弱になります！",
      "text_never_expires": "無期限 (期限なし)",
      "text_expires_at": "{time} に自動削除",
      "text_unlimited": "無制限",
      "footer_terms": "利用規約とプライバシー",
      "terms_title": "利用規約およびプライバシーポリシー",
      "admin_logs_title": "システム操作ログ",
      "log_th_time": "時間",
      "log_th_user": "ユーザー",
      "log_th_action": "アクション",
      "log_th_details": "詳細",
      "log_th_ip": "IPアドレス",
      "log_action_file": "ファイルアップロード",
      "log_action_text": "テキストアップロード",
      "log_empty": "操作ログはありません"
    }
  };

  let currentLang = localStorage.getItem('preferred_language') || 'zh-TW';

  // 自動偵測系統語言
  if (!localStorage.getItem('preferred_language')) {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('zh-CN') || browserLang.startsWith('zh-SG')) {
      currentLang = 'zh-CN';
    } else if (browserLang.startsWith('zh')) {
      currentLang = 'zh-TW';
    } else if (browserLang.startsWith('ja')) {
      currentLang = 'ja';
    } else {
      currentLang = 'en';
    }
    localStorage.setItem('preferred_language', currentLang);
  }

  // 取得翻譯字串
  function t(key, replacements = {}) {
    const langDict = translations[currentLang] || translations['zh-TW'];
    let text = langDict[key] || translations['zh-TW'][key] || key;
    
    // 取代變數，例如 {time}
    for (const [k, v] of Object.entries(replacements)) {
      text = text.replace(`{${k}}`, v);
    }
    return text;
  }

  // 執行全網頁語系翻譯
  function translatePage() {
    // 1. 翻譯所有帶有 data-i18n 的文字元素 (改用 innerHTML 允許帶有 HTML tags 的語系字典如 upload_title)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.innerHTML = t(key);
    });

    // 2. 翻譯所有帶有 data-i18n-placeholder 的輸入框
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', t(key));
    });

    // 3. 翻譯所有帶有 data-i18n-title 的提示元素
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.setAttribute('title', t(key));
    });

    // 4. 更新語言切換按鈕文字
    const langLabels = {
      'zh-TW': '繁體中文',
      'zh-CN': '简体中文',
      'en': 'English',
      'ja': '日本語'
    };
    const currentLabel = document.getElementById('current-lang-label');
    if (currentLabel) {
      currentLabel.textContent = langLabels[currentLang] || '繁體中文';
    }

    // 5. 更新 dropdown 選項 active 狀態
    document.querySelectorAll('.lang-opt').forEach(opt => {
      if (opt.getAttribute('data-lang') === currentLang) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    // 6. 如果有 file-limit-text 重新計算與提示上傳限制文字
    const fileLimitText = document.getElementById('file-limit-text');
    if (fileLimitText && window.MAX_FILE_SIZE_MB) {
      const limitMb = window.MAX_FILE_SIZE_MB;
      let limitStr = '';
      if (limitMb >= 1000 * 1024) {
        limitStr = t('text_unlimited');
      } else if (limitMb >= 1024) {
        limitStr = `${(limitMb / 1024).toFixed(1)}GB`;
      } else {
        limitStr = `${limitMb}MB`;
      }
      fileLimitText.innerHTML = t('upload_subtitle', { limit: limitStr });
    }
  }

  // 設定語系並儲存
  function setLanguage(lang) {
    if (translations[lang]) {
      currentLang = lang;
      localStorage.setItem('preferred_language', lang);
      translatePage();
      // 觸發自定義事件，讓 app.js 也能更新動態文字
      document.dispatchEvent(new CustomEvent('languagechanged', { detail: lang }));
    }
  }

  // 註冊全域物件
  window.i18n = {
    t: t,
    setLanguage: setLanguage,
    translatePage: translatePage,
    getCurrentLanguage: () => currentLang,
    termsContent: {
      "zh-TW": `
        <h4 style="margin-top: 0; color: var(--accent-cyan); font-weight: 600;">一、 我們收集與記錄的資訊</h4>
        <p style="margin-top: 4px;">為維護平台安全防護與防止系統遭濫用，我們會記錄以下資訊，並於檔案自動銷毀時同步徹底刪除：</p>
        <ul style="margin-left: 20px; list-style-type: disc; margin-top: 8px;">
          <li>上傳檔案之元數據（名稱、大小、類型）。</li>
          <li>上傳之文字快傳內容。</li>
          <li><b>上傳與提取時的網路 IP 位址</b>（用作安全審計與防暴力破解的日誌分析）。</li>
          <li>上傳、存取與自動銷毀的時間戳記。</li>
        </ul>
        <h4 style="margin-top: 16px; color: var(--accent-cyan); font-weight: 600;">二、 禁止的濫用與違法行為</h4>
        <p style="margin-top: 4px;">本平台嚴厲禁止以下任何非法或損害他人權益的行爲。一經發現，將立即物理刪除檔案並封鎖相關 IP：</p>
        <ul style="margin-left: 20px; list-style-type: disc; margin-top: 8px;">
          <li>禁止上傳或分享任何未經授權的盜版、破解軟體及影音版權資源。</li>
          <li><b>嚴厲禁止上傳或傳播兒童色情（CSAM）、性虐待、極度暴力或恐怖主義內容（對此採取零容忍原則）。</b></li>
          <li>禁止分發任何惡意軟體、電腦病毒、木馬程式或進行網路釣魚攻擊。</li>
          <li>禁止利用本服務從事任何違反本地或國際法律法規的行為。</li>
        </ul>
        <p style="margin-top: 16px; color: var(--text-secondary); font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">* 違反本條款者，本平台保留主動向相關司法與執法部門提交存取日誌（包含 IP 位址與上傳時間）的權利。</p>
      `,
      "zh-CN": `
        <h4 style="margin-top: 0; color: var(--accent-cyan); font-weight: 600;">一、 我们收集与记录的信息</h4>
        <p style="margin-top: 4px;">为维护平台安全防护与防止系统遭滥用，我们会记录以下信息，并于文件自动销毁时同步彻底删除：</p>
        <ul style="margin-left: 20px; list-style-type: disc; margin-top: 8px;">
          <li>上传文件的元数据（名称、大小、类型）。</li>
          <li>上传的文本快传内容。</li>
          <li><b>上传与提取时的网络 IP 地址</b>（用作安全审计与防暴力破解的日志分析）。</li>
          <li>上传、访问与自动销毁的时间戳。</li>
        </ul>
        <h4 style="margin-top: 16px; color: var(--accent-cyan); font-weight: 600;">二、 禁止的滥用与违法行为</h4>
        <p style="margin-top: 4px;">本平台严厉禁止以下任何非法或损害他人权益的行为。一经发现，将立即物理删除文件并封禁相关 IP：</p>
        <ul style="margin-left: 20px; list-style-type: disc; margin-top: 8px;">
          <li>禁止上传或分享任何未经授权的盗版软件、影音等版权资源。</li>
          <li><b>严厉禁止上传或传播儿童色情（CSAM）、性虐待、极度暴力或恐怖主义内容（对此采取零容忍原则）。</b></li>
          <li>禁止分发任何恶意软件、病毒、木马或进行网络钓鱼攻击。</li>
          <li>禁止利用本服务从事任何违反本地或国际法律法规的行为。</li>
        </ul>
        <p style="margin-top: 16px; color: var(--text-secondary); font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">* 违反本条款者，本平台保留主动向相关司法与执法部门提交访问日志（包含 IP 地址与上传时间）的权利。</p>
      `,
      "en": `
        <h4 style="margin-top: 0; color: var(--accent-cyan); font-weight: 600;">1. Information We Collect & Log</h4>
        <p style="margin-top: 4px;">To ensure system stability, detect abuse, and protect against security threats, we record the following metadata. These records are permanently erased upon file destruction:</p>
        <ul style="margin-left: 20px; list-style-type: disc; margin-top: 8px;">
          <li>Metadata of uploaded files (file name, size, type).</li>
          <li>Plain text content submitted via text sharing.</li>
          <li><b>Originating IP addresses</b> of both uploaders and downloaders (used for rate-limiting and brute-force protection).</li>
          <li>Timestamps of upload, access, and self-destruction.</li>
        </ul>
        <h4 style="margin-top: 16px; color: var(--accent-cyan); font-weight: 600;">2. Strictly Prohibited Activities</h4>
        <p style="margin-top: 4px;">Any misuse or illegal usage of our platform is strictly prohibited. Violation will result in immediate file deletion and IP blacklisting:</p>
        <ul style="margin-left: 20px; list-style-type: disc; margin-top: 8px;">
          <li>Do not upload or share pirated software, cracked resources, or unauthorized copyrighted media.</li>
          <li><b>Strictly prohibited to upload or distribute child sexual abuse material (CSAM), sexual violence, extreme gore, or terrorism content (Zero-Tolerance Policy).</b></li>
          <li>Do not distribute malware, viruses, trojans, or engage in phishing campaigns.</li>
          <li>Do not use this service for any illegal activities violating local or international laws.</li>
        </ul>
        <p style="margin-top: 16px; color: var(--text-secondary); font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">* We reserve the right to report illegal files and hand over operational access logs (including IP addresses) to relevant law enforcement agencies.</p>
      `,
      "ja": `
        <h4 style="margin-top: 0; color: var(--accent-cyan); font-weight: 600;">1. 収集およびログ記録する情報</h4>
        <p style="margin-top: 4px;">システムの安定稼働、セキュリティ保護、および不正使用防止のため、以下の情報を記録します。これらのデータは共有の消去時に同時に物理削除されます：</p>
        <ul style="margin-left: 20px; list-style-type: disc; margin-top: 8px;">
          <li>アップロードされたファイルのメタデータ（ファイル名、ファイルサイズ、種類）。</li>
          <li>テキスト送信で送信されたテキスト内容。</li>
          <li><b>アップロードおよびダウンロード時の接続元 IP アドレス</b>（総当たり攻撃や不正アクセスの検知に使用されます）。</li>
          <li>アップロード、アクセス、および自動削除のタイムスタンプ。</li>
        </ul>
        <h4 style="margin-top: 16px; color: var(--accent-cyan); font-weight: 600;">2. 禁止事項および不正行為</h4>
        <p style="margin-top: 4px;">当プラットフォームでの違法行為または他者の権利を侵害する行為は一切禁止されています。違反が確認された場合、ファイルは即時削除され、IPアドレスがブロックされます：</p>
        <ul style="margin-left: 20px; list-style-type: disc; margin-top: 8px;">
          <li>無断の海賊版ソフト、クラックされたツール、および著作権を侵害する映像・音楽リソースの共有。</li>
          <li><b>児童ポルノ（CSAM）、性的虐待、過激な暴力表現、またはテロ関連コンテンツの配布・アップロード（完全なゼロ・トレランス厳罰対象）。</b></li>
          <li>マルウェア、ウイルス、トロイの木馬などの有害なプログラムの配布、またはフィッシング行為。</li>
          <li>現地法または国際法に違反するあらゆる不正行為。</li>
        </ul>
        <p style="margin-top: 16px; color: var(--text-secondary); font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">* 規約違反があった場合、当サービスは関連する法執行機関や司法機関に対し、アクセスログ（IPアドレスと時間情報を含む）を提供する権利を留保します。</p>
      `
    }
  };

  // 頁面就緒時自動翻譯一次
  document.addEventListener('DOMContentLoaded', () => {
    // 綁定語言選擇器切換事件
    const trigger = document.getElementById('lang-trigger');
    const dropdown = document.getElementById('lang-dropdown');

    if (trigger && dropdown) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
      });

      document.addEventListener('click', () => {
        dropdown.classList.remove('active');
      });

      document.querySelectorAll('.lang-opt').forEach(opt => {
        opt.addEventListener('click', () => {
          const selected = opt.getAttribute('data-lang');
          setLanguage(selected);
          dropdown.classList.remove('active');
        });
      });
    }

    translatePage();
  });
})();
