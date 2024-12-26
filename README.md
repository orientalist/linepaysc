# LINE Pay Integration with Node.js

## 簡介
本專案是一個 Node.js 應用程式，旨在整合 LINE Pay 支付服務，以便從用戶那裡收集產品訂單並發起支付請求。應用程序可用於接受來自調查的產品數量並計算總價格，以便安全地使用 LINE Pay 進行交易。

## 功能
- 支持從調查數據中提取產品及其數量。
- 自動計算每個產品的總價。
- 向 LINE Pay 發送支付請求並返回支付網址。
- 處理支付成功或取消的回調。

## 安裝與使用方式
1. **克隆本專案**
   ```bash
   git clone https://github.com/<your-username>/line-pay-integration.git
   cd line-pay-integration
   ```
   
2. **安裝依賴模組**
   ```bash
   npm install
   ```
   
3. **配置 LINE Pay 參數**
   - 在程式碼中填寫 `LINE_PAY_URL`、`CHANNEL_ID`、`CHANNEL_SECRET` 和 `SURVEYCAKE_DOMAIN`。
   - 設置 `CALLBACK_URL` 為您的後端支付回調地址。

4. **運行應用程序**
   ```bash
   node index.js
   ```

5. **訪問應用程序**
   - 您可以通過發送包含 `svid` 和 `hash` 的請求至應用程序，來測試支付發起功能。

## 必要的依賴模組清單
- `axios` - 用於發送 HTTP 請求。
- `crypto` - 用於加密/解密和創建哈希。

請在專案根目錄下的 `package.json` 檔案中確認，這些依賴已經正確列出。

## 授權條款
本專案使用 MIT 授權條款。詳細授權信息可參考 `LICENSE` 檔案。