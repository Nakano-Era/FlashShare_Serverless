# ⚡ FlashShare - Cloudflare Serverless (Worker) 部署指南

本目錄 (`/CF-Version`) 是 FlashShare 的 **完全免 VPS (Serverless) 版本**。它利用 **Cloudflare Workers** 託管核心 API 路由並提供靜態資源服務，**Cloudflare KV** 作為無伺服器資料庫，以及 **Cloudflare R2** 儲存上傳的檔案。

此版本具備極高的高可用性、防 DDoS 能力，並且在 Cloudflare 免費額度內**完全免費**。

---

## 🛠️ 部署前準備 (Windows 與通用環境)

### 1. 安裝 Node.js
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

### 4. 建立 KV 命名空間 (用於資料庫)
建立一個名為 `DB` 的 KV 命名空間：
```bash
npx wrangler kv namespace create DB
```
執行後，終端機將會輸出類似以下的內容：
```toml
[[kv_namespaces]]
binding = "DB"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```
請複製此 `id` 欄位的值。

### 5. 啟用與建立 R2 儲存桶 (用於檔案儲存)
1. 登入 [Cloudflare 控制台](https://dash.cloudflare.com/) ➔ 點擊左側選單的 **「R2」** ➔ 點擊 **「啟用 R2 (Enable R2)」** 並綁定您的付款方式（10GB 內完全免費，不會扣款）。
2. 在您的本機終端機中建立儲存桶：
   ```bash
   npx wrangler r2 bucket create flashshare-storage
   ```

---

## ⚙️ 調整設定檔

打開 `CF-Version/wrangler.toml` 檔案，將剛剛產生的資訊填入：

```toml
name = "flashshare"
main = "index.js"
compatibility_date = "2024-03-01"

[assets]
directory = "./public"
binding = "ASSETS"

[[kv_namespaces]]
binding = "DB"
id = "在此處填入您產生的 KV Namespace ID"

[[r2_buckets]]
binding = "STORAGE"
bucket_name = "flashshare-storage" # 若您使用了不同的儲存桶名稱請在此修改

[triggers]
crons = ["*/30 * * * *"] # 每 30 分鐘自動執行一次過期清理
```

---

## 🚀 一鍵部署至 Cloudflare Workers

切換到 `CF-Version` 目錄下並執行部署：
```bash
# 進入目錄
cd CF-Version

# 部署服務與靜態資源
npx wrangler deploy
```
*   **注意**：請確保執行的是 `npx wrangler deploy`，**不要**包含 `pages` 參數。這會將專案作為標準 Worker 部署，並**一併自動將定時清理排程上傳註冊**，您無須在控制台手動設定任何內容！
*   部署完成後，Wrangler 會提供您一個免費的專案網址（例如：`https://flashshare.<您的子網域>.workers.dev`）。

---

## 🔑 初始化管理員帳號

- 部署完成後，打開您的專案網址。
- **系統會自動進行初始化**。
- 您可以直接點選「登入」，並輸入預設的管理員帳號密碼：
  - **預設帳號**：`admin`
  - **預設密碼**：`admin_flash_2026`
- **安全建議**：登入後，請務必點擊右上角使用者選單的「修改密碼」，以變更預設的管理員密碼。

---

## ⏱️ 自動銷毀與長期儲存 (永久檔案) 機制

此 Serverless 版本採用 **「雙重物理銷毀」** 策略，完美解決臨時檔案的清理並保全長期儲存檔案：

1. **主動觸發銷毀 (即時清理)**：
   - 當任何人訪問已經過期的提取連結、或者嘗試進行下載時，後端 Worker 在讀取該分享項目時會主動判定是否過期。
   - **如果過期**：Worker 將立刻向 Cloudflare R2 發送指令刪除實體檔案，並同時移除該項目在 KV 中的元數據。這保證了過期檔案「一經點擊即物理蒸發」。
2. **背景排程清理 (Cron Trigger)**：
   - 為了清理那些過期後無人訪問的垃圾檔案，本專案在 `index.js` 中實現了 `scheduled` 監聽器。
   - 此排程已由 `wrangler.toml` 中的 `[triggers.crons]` 自動註冊，它會每 30 分鐘自動在雲端執行！
3. **長期儲存防誤刪保護**：
   - 對於註冊會員所建立的「永久儲存」檔案，其資料庫中的過期時間戳記會被記錄為 `null`。
   - 所有的自動清理邏輯（主動與排程）均包含 `share.expiresAt !== null` 斷言判斷，因此**絕對不會誤刪永久儲存檔案**。永久檔案僅能由上傳者手動點擊「銷毀」時才會被物理抹除。

---

## 📁 檔案結構說明

- `wrangler.toml`：Cloudflare 部署與綁定設定檔。
- `index.js`：核心 Worker API 路由、R2 串流與 KV 資料庫存取邏輯（置於根目錄）。
- `public/`：靜態資源目錄。
  - `index.html`：多語系前端主頁面。
  - `style.css`：前端樣式與毛玻璃特效。
  - `app.js`：前端互動邏輯（與 API 進行溝通）。
  - `i18n.js`：多國語系翻譯字典與條款內容。
