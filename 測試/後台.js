const PASSWORD = "nggchr"; // ✅ 設定密碼

    // ⬛ 初始化：載入來客數與中獎次數
    window.onload = function () {
      loadGuestLog(); // 載入每日來客數紀錄
      loadWinStats(); // 載入中獎次數
    }

    // 🟨 儲存來客數功能
    function saveGuestCount() {
      const date = document.getElementById("visit-date").value; // 取得日期
      const count = document.getElementById("visit-count").value; // 取得數量
      if (!date || count === "") {
        alert("請輸入日期與人數"); return; // 驗證輸入
      }

      let logs = JSON.parse(localStorage.getItem("guestLog") || "{}"); // 讀取記錄
      if (logs[date]) {
        const pw = prompt("此日期已有紀錄，請輸入密碼以覆蓋："); // 顯示提示窗
        if (pw !== PASSWORD) {
          alert("密碼錯誤，取消儲存"); return; // 密碼錯誤
        }
      }

      logs[date] = count; // 儲存人數
      localStorage.setItem("guestLog", JSON.stringify(logs)); // 更新本地儲存
      loadGuestLog(); // 更新畫面
      alert("來客數已儲存！");
    }

    // 🟩 載入每日來客數紀錄
    function loadGuestLog() {
      const logs = JSON.parse(localStorage.getItem("guestLog") || "{}"); // 讀取記錄
      const logDiv = document.getElementById("guest-log"); // 顯示區塊
      if (Object.keys(logs).length === 0) {
        logDiv.textContent = "尚無記錄"; return;
      }
      logDiv.innerHTML = ""; // 清空內容
      for (let date in logs) {
        const p = document.createElement("p"); // 建立段落
        p.textContent = `${date}：${logs[date]}人`; // 顯示格式
        logDiv.appendChild(p);
      }
    }

    // 🟥 顯示中獎次數
    function loadWinStats() {
      const stats = JSON.parse(localStorage.getItem("winStats") || "[]"); // 讀取中獎統計
      const div = document.getElementById("win-stats"); // 顯示區塊
      if (stats.length === 0) {
        div.innerHTML = "尚無中獎紀錄";
        return;
      }
      div.innerHTML = ""; // 清空內容
      stats.forEach((count, index) => {
        const p = document.createElement("p"); // 建立段落
        p.textContent = `區間 ${index + 1}：${count} 次`; // 顯示內容
        div.appendChild(p);
      });
    }

    // 🔁 重設中獎次數確認
    function confirmResetWinners() {
      const pw = prompt("請輸入密碼以重設中獎次數："); // 提示輸入密碼
      if (pw === PASSWORD) {
        localStorage.removeItem("winStats"); // 清除紀錄
        alert("中獎次數已重設");
        loadWinStats(); // 更新畫面
      } else {
        alert("密碼錯誤，取消操作");
      }
    }

    // 🔁 重設轉動次數確認
    function confirmResetSpins() {
      const pw = prompt("請輸入密碼以重設轉動次數："); // 提示輸入密碼
      if (pw === PASSWORD) {
        localStorage.removeItem("spinCount"); // 清除次數
        alert("轉動次數已重設");
      } else {
        alert("密碼錯誤，取消操作");
      }
    }
    // 同步前台頁面資料
function syncFrontend() {
    const event = new CustomEvent("syncData"); // 觸發自定義事件
    window.dispatchEvent(event); // 發送事件到前台
}
// JavaScript：重設 localStorage 中的 remainingSpins 值
document.getElementById('reset-spins-btn').addEventListener('click', () => {    // 取得按鈕
    const confirmReset = confirm("確定要重設前台的旋轉次數嗎？");   // 顯示確認視窗
    if (confirmReset) {   // 如果確認重設
        localStorage.setItem('remainingSpins', 2000); // 重設為預設值 2000 
        alert("前台旋轉次數已成功重設！");
    }
});
