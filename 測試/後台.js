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
  const stats = getLocalStorageItem("winStats", []);
  const labels = getLocalStorageItem("prizeLabels", []);
  const div = document.getElementById("win-stats");

  if (stats.length === 0 || labels.length === 0) {
    div.innerHTML = "尚無中獎紀錄";
    return;
  }

  const mergedStats = {};
  stats.forEach((count, index) => {
    const label = labels[index] || `區間 ${index + 1}`;
    if (mergedStats[label]) {
      mergedStats[label] += count;
    } else {
      mergedStats[label] = count;
    }
  });

  div.innerHTML = "";
  for (let label in mergedStats) {
    const p = document.createElement("p");
    p.textContent = `${label}：${mergedStats[label]} 次`;
    div.appendChild(p);
  }
}

// ✅ 顯示剩餘旋轉次數（後台用）
function loadRemainingSpins() {
  const spins = localStorage.getItem("remainingSpins") || "0";
  document.getElementById("remaining-count-backend").textContent = spins;
}

// 🔁 重設剩餘旋轉次數
function resetSpins() {
  localStorage.setItem('remainingSpins', '2000'); // 設為預設值
  loadRemainingSpins(); // ✅ 立即更新畫面
  alert("旋轉次數已成功重設！");
}

// 🧹 重設中獎紀錄
function resetWinStats() {
  localStorage.setItem('winStats', JSON.stringify(Array(10).fill(0))); // 重設為全 0
  loadWinStats(); // ✅ 立即更新畫面
  alert("中獎紀錄已成功重設！");
}

// ✅ 初始化頁面與按鈕監聽
function initializePage() {
  loadGuestLog();        // 載入來客數
  loadWinStats();        // 載入中獎統計
  loadRemainingSpins();  // 載入剩餘次數

  // 🔐 綁定重設旋轉次數按鈕
  document.getElementById("reset-spins-btn").addEventListener("click", () => {
    if (checkPassword()) {
      resetSpins(); // ✅ 會立即更新
    }
  });

  // 🔐 綁定重設中獎紀錄按鈕
  document.getElementById("reset-win-stats-btn").addEventListener("click", () => {
    if (checkPassword()) {
      resetWinStats(); // ✅ 會立即更新
    }
  });
}

// 💾 儲存與讀取 localStorage 的工具
function getLocalStorageItem(key, defaultValue) {
  return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue));
}

function setLocalStorageItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// 🔐 密碼驗證
function checkPassword() {
  const pw = prompt("請輸入密碼：");
  if (pw === PASSWORD) {
    return true;
  } else {
    alert("密碼錯誤");
    return false;
  }
}

// 🚀 頁面載入後自動初始化
window.onload = initializePage;
