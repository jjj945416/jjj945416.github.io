const PASSWORD = "nggchr"; // ✅ 設定密碼

// 🟨 儲存來客數功能
function saveGuestCount() {
  const date = document.getElementById("visit-date").value;
  const count = document.getElementById("visit-count").value;
  if (!date || count === "") {
    alert("請輸入日期與人數");
    return;
  }

  let logs = getLocalStorageItem("guestLog", {});
  if (logs[date]) {
    if (!checkPassword()) return;
  }

  logs[date] = count;
  setLocalStorageItem("guestLog", logs);
  loadGuestLog();
  alert("來客數已儲存！");
}

// 🟩 載入每日來客數紀錄
function loadGuestLog() {
  const logs = getLocalStorageItem("guestLog", {});
  const logDiv = document.getElementById("guest-log");
  if (Object.keys(logs).length === 0) {
    logDiv.textContent = "尚無記錄";
    return;
  }
  logDiv.innerHTML = "";
  for (let date in logs) {
    const p = document.createElement("p");
    p.textContent = `${date}：${logs[date]}人`;
    logDiv.appendChild(p);
  }
}

// 🟥 顯示中獎次數（合併相同獎項名稱）
function loadWinStats() { 
  const stats = getLocalStorageItem("winStats", []);  // 獲取中獎次數
  const labels = getLocalStorageItem("prizeLabels", []);  // 獲取獎項名稱
  const div = document.getElementById("win-stats"); // 獲取顯示區域

  if (stats.length === 0) { // 如果沒有中獎紀錄
    div.innerHTML = "尚無中獎紀錄"; // 顯示提示訊息
    return; // 顯示提示訊息
  }

  div.innerHTML = ""; // 清空顯示區域
  stats.forEach((count, index) => {
    const p = document.createElement("p");
    const label = labels[index] || `區間 ${index + 1}`;
    p.textContent = `${label}：${count} 次`;
    div.appendChild(p);
  });
  // 🔴 注意：這段 mergedStats 的程式碼不完整，建議移除或補上相關邏輯
  // Object.entries(mergedStats).forEach(([label, count]) => {
  //   const p = document.createElement("p");
  //   p.textContent = ${label}：${count} 次;
  //   div.appendChild(p);
  // });
}

// 🔁 重設中獎次數確認 
function confirmResetWinners() {  // 確認重設中獎次數
  if (checkPassword()) {  // 如果密碼正確
    localStorage.removeItem("winStats");  // 清除中獎次數
    alert("中獎次數已重設");  // 提示重設成功
    loadWinStats(); // 載入中獎統計資料
  }
}

// 例如在後台頁面處理重設旋轉次數的按鈕事件中
function resetSpins() { // 重設旋轉次數
  localStorage.setItem('remainingSpins', '2000'); // 更新旋轉次數為 2000
  localStorage.setItem('angleHitCounts', JSON.stringify(Array(10).fill(0))); // 重設每個角度區間的中獎次數

  // 發送自訂事件，通知前台頁面更新
  window.dispatchEvent(new Event('resetSpins'));  // 發送重設事件
}

// 假設這是按鈕觸發重設
const resetButton = document.getElementById('reset-button');  // 假設這是重設按鈕的 ID
resetButton.addEventListener('click', resetSpins);  // 監聽重設事件

// 📌 監聽同步資料事件
window.addEventListener("syncData", function () {
  const remainingSpins = localStorage.getItem("remainingSpins");  // 取得剩餘旋轉次數
  updateBackendData(remainingSpins); // 假設你有這個同步資料的後端函式
});
// 在後台頁面中監聽 localStorage 的變動
window.addEventListener('storage', (event) => {
  if (event.key === 'remainingSpins') {
      const updatedRemainingSpins = localStorage.getItem('remainingSpins');
      document.getElementById('remaining-count-backend').textContent = updatedRemainingSpins; // 更新後台顯示
  }
});
// 🔁 更新後台資料的函式範例
function updateBackendData(spins) {
  // 這裡可以加上同步後端的邏輯，傳送 remainingSpins 到後端
  console.log(`同步資料到後端，剩餘旋轉次數: ${spins}`);
}

// 同步前台頁面資料
function syncFrontend() {
  const event = new CustomEvent("syncData");
  window.dispatchEvent(event);
}

// ✅ 將初始化與按鈕監聽寫在 onload 中
window.onload = function () {
  loadGuestLog();
  loadWinStats();

  document.getElementById("reset-spins-btn").addEventListener("click", () => {
    if (checkPassword()) {
      localStorage.setItem("remainingSpins", 2000);
      alert("前台旋轉次數已成功重設！");
    }
  });
};

// 🚀 優化本地儲存存取函式（放在全域）
function getLocalStorageItem(key, defaultValue) {
  return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue));
}

function setLocalStorageItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// 🔐 密碼驗證（放在全域）
function checkPassword() {
  const pw = prompt("請輸入密碼：");
  if (pw === PASSWORD) {
    return true;
  } else {
    alert("密碼錯誤");
    return false;
  }
}
