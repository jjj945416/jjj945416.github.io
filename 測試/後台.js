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
function confirmResetWinners() {
  if (checkPassword()) {
    localStorage.removeItem("winStats");
    alert("中獎次數已重設");
    loadWinStats();
  }
}

// 📌 監聽同步資料事件
window.addEventListener("syncData", function () {
  const remainingSpins = localStorage.getItem("remainingSpins");
  updateBackendData(remainingSpins);
});

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
