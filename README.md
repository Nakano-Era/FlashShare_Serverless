# ⚡ FlashShare - Cloudflare Serverless 部署指南

本目錄 (`/CF-Version`) 是 FlashShare 的 **完全無 VPS (Serverless) 版本**。它利用 **Cloudflare Pages** 託管靜態前端，**Cloudflare Workers** 處理所有 API 路由，**Cloudflare KV** 作為資料庫（快取 Session、使用者與分享資訊），以及 **Cloudflare R2** 儲存上傳的檔案。

此版本具備極高的高可用性、防 DDoS 能力，並且在 Cloudflare 免費額度內**完全免費**。

---

## 🛠️ 部署前準備 (Windows 與通用環境)

### 1. 安裝 Node.js (Windows 使用者)
如果您尚未安裝 Node.js：
1. 請前往 [Node.js 官方網站](https://nodejs.org/) 下載並安裝 **LTS 穩定版本** (推薦 `.msi` 安裝包)。
2. 安裝時，請勾選 "Automatically install the necessary tools..."（這會自動設定環境變數 PATH）。
3. 安裝完成後，請**重啟您的終端機**（命令提示字元 Cmd 或 PowerShell）。
4. 驗證安裝成功：
   ```bash
   node -v
   npm -v
   ```

### 2. Windows 終端機權限設定 (僅 PowerShell 使用者)
如果您在 Windows 上使用 **PowerShell**，執行 `npx wrangler` 可能會因為安全策略而受阻。
請先在 PowerShell 中執行以下指令以臨時允許執行指令碼（僅對當前視窗有效，安全無害）：
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

### 3. 登入 Cloudflare
在終端機中執行登入指令，系統會自動在瀏覽器彈出登入與授權視窗：
```bash
npx wrangler login
```
*提示：如果瀏覽器沒有自動打開，可以複製終端機中輸出的網址手動粘貼至瀏覽器訪問。*

### 2. 建立 KV 命名空間 (用於資料庫)
建立一個名為 `DB` 的 KV 命名空間：
```bash
npx wrangler kv:namespace create DB
```
執行後，終端機將會輸出類似以下的內容：
```toml
[[kv_namespaces]]
binding = "DB"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```
請複製此 `id` 欄位的值。

### 3. 建立 R2 儲存桶 (用於檔案儲存)
建立一個名為 `flashshare-storage` 的 R2 儲存桶：
```bash
npx wrangler r2 bucket create flashshare-storage
```

---

## ⚙️ 調整設定檔

打開 `CF-Version/wrangler.toml` 檔案，將剛剛產生的資訊填入：

```toml
name = "flashshare"
compatibility_date = "2024-03-01"
pages_build_output_dir = "./public"

[[kv_namespaces]]
binding = "DB"
id = "在此處填入您產生的 KV Namespace ID"

[[r2_buckets]]
binding = "STORAGE"
bucket_name = "flashshare-storage" # 若您使用了不同的儲存桶名稱請在此修改
```

---

## 🚀 一鍵部署至 Cloudflare Pages

切換到 `CF-Version` 目錄下並執行部署：
```bash
# 進入目錄
cd CF-Version

# 部署至 Pages
npx wrangler pages deploy ./public --project-name flashshare
```
1. 終端機會詢問是否建立新專案，選擇 `Yes`。
2. 詢問生產環境分支名稱，直接按 Enter 鍵使用預設的 `production`。
3. 部署完成後，Wrangler 會提供您一個免費的專案網址（例如：`https://flashshare.pages.dev`）。

---

## 🔑 初始化管理員帳號

- 部署完成後，打開您的專案網址。
- **系統會自動進行初始化**。
- 您可以直接點選「登入」，並輸入預設的管理員帳號密碼：
  - **預設帳號**：`admin`
  - **預設密碼**：`admin_flash_2026`
- **安全建議**：登入後，請務必點擊右上角使用者選單的「修改密碼」，以變更預設的管理員密碼。

---

## 📁 檔案結構說明

- `wrangler.toml`：Cloudflare 部署與綁定設定檔。
- `public/`：靜態網站根目錄。
  - `_worker.js`：核心 API 路由、R2 串流與 KV 資料庫存取邏輯。
  - `index.html`：多語系前端主頁面。
  - `style.css`：前端樣式與毛玻璃特效。
  - `app.js`：前端互動邏輯（與 API 進行溝通）。
  - `i18n.js`：多國語系翻譯字典與條款內容。
