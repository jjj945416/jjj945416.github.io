const PASSWORD = "nggchr"; // ✅ 設定密碼

// ⬛ 初始化：載入來客數與中獎次數
window.onload = function () {
  loadGuestLog();  // 載入來客數資料
  loadWinStats();   // 載入中獎次數資料
}

// 🟨 儲存來客數功能
function saveGuestCount() {
  const date = document.getElementById("visit-date").value; // 取得日期
  const count = document.getElementById("visit-count").value; // 取得數量
  if (!date || count === "") {
    alert("請輸入日期與人數");
    return; // 驗證輸入
  }

  let logs = getLocalStorageItem("guestLog", {}); // 讀取來客數紀錄
  if (logs[date]) {
    if (!checkPassword()) return; // 若已存在紀錄，需密碼驗證
  }

  logs[date] = count; // 儲存人數
  setLocalStorageItem("guestLog", logs); // 更新本地儲存
  loadGuestLog(); // 更新畫面
  alert("來客數已儲存！");
}

// 🟩 載入每日來客數紀錄
function loadGuestLog() {
  const logs = getLocalStorageItem("guestLog", {}); // 讀取來客數紀錄
  const logDiv = document.getElementById("guest-log"); // 顯示區塊
  if (Object.keys(logs).length === 0) {
    logDiv.textContent = "尚無記錄";
    return;
  }
  logDiv.innerHTML = ""; // 清空內容
  for (let date in logs) {
    const p = document.createElement("p"); // 建立段落
    p.textContent = `${date}：${logs[date]}人`; // 顯示格式
    logDiv.appendChild(p);
  }
}

// 🟥 顯示中獎次數（合併相同獎項名稱）
function loadWinStats() {
    const stats = getLocalStorageItem("winStats", []); // 讀取中獎次數
    const labels = getLocalStorageItem("prizeLabels", []); // 讀取獎項名稱
  
    const div = document.getElementById("win-stats"); // 顯示區塊
  
    if (stats.length === 0) {
      div.innerHTML = "尚無中獎紀錄"; // 顯示提示
      return;
    }
  
    div.innerHTML = ""; // 清空內容
  
    stats.forEach((count, index) => {
      const p = document.createElement("p"); // 建立段落
      const label = labels[index] || `區間 ${index + 1}`; // 若無名稱則顯示區間編號
      p.textContent = `${label}：${count} 次`; // 顯示內容
      div.appendChild(p); // 加入段落
    });
  }
  
  
    // 將合併後的統計結果依序顯示
    Object.entries(mergedStats).forEach(([label, count]) => {
      const p = document.createElement("p"); // 建立段落
      p.textContent = `${label}：${count} 次`; // 顯示內容
      div.appendChild(p); // 加入顯示區塊
    });
  

// 🔁 重設中獎次數確認
function confirmResetWinners() {
  if (checkPassword()) {
    localStorage.removeItem("winStats"); // 清除紀錄
    alert("中獎次數已重設");
    loadWinStats(); // 更新畫面
  }
}

// 📌 監聽同步資料事件
window.addEventListener('syncData', function() {
  const remainingSpins = localStorage.getItem('remainingSpins');  // 讀取剩餘次數
  updateBackendData(remainingSpins);  // 更新後台資料
});

// 同步前台頁面資料
function syncFrontend() {
  const event = new CustomEvent("syncData"); // 觸發自定義事件
  window.dispatchEvent(event); // 發送事件到前台
}

// JavaScript：重設 localStorage 中的 remainingSpins 值（加上密碼驗證）
document.getElementById('reset-spins-btn').addEventListener('click', () => {
  if (checkPassword()) {
    localStorage.setItem('remainingSpins', 2000); // 設定為初始值 2000
    alert("前台旋轉次數已成功重設！");
  }
});

// 🚀 優化本地儲存存取函式
function getLocalStorageItem(key, defaultValue) {
  return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue)); // 設定默認值
}

function setLocalStorageItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value)); // 儲存資料
}

// 檢查密碼
function checkPassword() {
  const pw = prompt("請輸入密碼："); // 提示輸入密碼
  if (pw === PASSWORD) {
    return true;
  } else {
    alert("密碼錯誤");
    return false;
  }
}