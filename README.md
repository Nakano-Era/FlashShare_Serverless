# ⚡ FlashShare - Cloudflare Serverless 部署指南

本目錄 (`/CF-Version`) 是 FlashShare 的 **完全無 VPS (Serverless) 版本**。它利用 **Cloudflare Pages** 託管靜態前端，**Cloudflare Workers** 處理所有 API 路由，**Cloudflare KV** 作為資料庫（快取 Session、使用者與分享資訊），以及 **Cloudflare R2** 儲存上傳的檔案。

此版本具備極高的高可用性、防 DDoS 能力，並且在 Cloudflare 免費額度內**完全免費**。

---

## 🛠️ 部署前準備

請確保您已安裝 Node.js，並擁有一個 Cloudflare 帳號。

### 1. 登入 Cloudflare
在本機終端機中執行登入指令，瀏覽器會彈出視窗授權：
```bash
npx wrangler login
```

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
