const PASSWORD = "nggchr"; // ✅ 設定密碼

// 🟨 儲存來客數功能
function saveGuestCount() {
  const date = document.getElementById("visit-date").value; // 取得日期
  const count = document.getElementById("visit-count").value; // 取得人數
  if (!date || count === "") {  // 檢查日期與人數是否輸入
    alert("請輸入日期與人數");  // 提示訊息
    return;
  }

  let logs = getLocalStorageItem("guestLog", {}); // 取得來客數紀錄
  if (logs[date]) { // 如果該日期已存在紀錄
    if (!checkPassword()) return; // 驗證密碼
  }

  logs[date] = count; // 更新紀錄
  setLocalStorageItem("guestLog", logs);  // 儲存到 localStorage
  loadGuestLog(); // 重新載入來客數紀錄
  alert("來客數已儲存！");  // 提示訊息
}

// 🟩 載入每日來客數紀錄
function loadGuestLog() { // 獲取來客數紀錄
  const logs = getLocalStorageItem("guestLog", {}); // 取得來客數紀錄
  const logDiv = document.getElementById("guest-log");  // 獲取顯示區域
  if (Object.keys(logs).length === 0) { // 如果沒有紀錄
    logDiv.textContent = "尚無記錄";  // 顯示提示訊息
    return;
  }
  logDiv.innerHTML = "";  // 清空顯示區域
  for (let date in logs) {  // 遍歷紀錄
    const p = document.createElement("p");  // 創建段落元素
    p.textContent = `${date}：${logs[date]}人`; // 設定內容
    logDiv.appendChild(p);  // 添加到顯示區域
  }
}

// 🟥 顯示中獎次數（合併相同獎項名稱）
function loadWinStats() { 
  const stats = getLocalStorageItem("winStats", []);  // 取得每個格子的中獎次數陣列
  const labels = getLocalStorageItem("prizeLabels", []);  // 取得獎項名稱陣列
  const div = document.getElementById("win-stats"); // 顯示區域

  if (stats.length === 0 || labels.length === 0) {
    div.innerHTML = "尚無中獎紀錄"; // 無紀錄提示
    return;
  }

  // 🧮 建立一個合併結果物件
  const mergedStats = {};

  stats.forEach((count, index) => {
    const label = labels[index] || `區間 ${index + 1}`; // 取得該格獎項名稱
    if (mergedStats[label]) {
      mergedStats[label] += count; // 如果已存在該品名，就累加次數
    } else {
      mergedStats[label] = count; // 否則建立新記錄
    }
  });

  // 清空顯示區域
  div.innerHTML = "";

  // 🖨️ 顯示合併後的結果
  for (let label in mergedStats) {
    const p = document.createElement("p");
    p.textContent = `${label}：${mergedStats[label]} 次`;
    div.appendChild(p);
  }
}

// 讀取中獎次數與獎項名稱
function updatePrizeStatistics() {
  // 從 localStorage 取得中獎次數與獎項名稱
  const winStats = JSON.parse(localStorage.getItem('winStats')) || new Array(options.length).fill(0);
  const prizeLabels = JSON.parse(localStorage.getItem('prizeLabels')) || [];

  // 確保顯示的元素存在
  const prizeList = document.getElementById('prize-list');
  
  // 清空舊的顯示內容
  prizeList.innerHTML = '';
  
  // 檢查資料是否存在
  if (prizeLabels.length > 0) {
      prizeLabels.forEach((label, index) => {
          // 創建顯示區塊
          const prizeItem = document.createElement('div');
          prizeItem.classList.add('prize-item');
          
          // 顯示獎項名稱與對應中獎次數
          prizeItem.innerHTML = `${label}: ${winStats[index]} 次`;
          
          // 將結果加到列表中
          prizeList.appendChild(prizeItem);
      });
  } else {
      // 如果沒有獎項名稱，顯示提示
      prizeList.innerHTML = '<p>尚未設置獎項。</p>';
  }
}

// 🧮 顯示剩餘旋轉次數（後台用）
function loadRemainingSpins() {
  const spins = localStorage.getItem("remainingSpins") || "0"; // 預設為 0
  document.getElementById("remaining-count-backend").textContent = spins; // 顯示在頁面上
}

// 🔁 重設旋轉次數
function resetSpins() {
  localStorage.setItem('remainingSpins', '2000'); // 重設次數
  localStorage.setItem('angleHitCounts', JSON.stringify(Array(10).fill(0))); // 重設每區中獎次數

  // 發送自訂事件，通知前台更新
  window.dispatchEvent(new Event('resetSpins'));  // 發送事件
}

// 📡 監聽前台更新資料事件
window.addEventListener('resetSpins', function () {
  const spins = localStorage.getItem("remainingSpins");  // 取得剩餘旋轉次數
  document.getElementById("remaining-count").textContent = spins;  // 更新前台剩餘次數顯示
  alert("前台旋轉次數已成功重設！");  // 提示訊息
});

// 🔄 監聽 localStorage 改變
window.addEventListener('storage', (event) => {
  if (event.key === 'remainingSpins') {
    const updatedRemainingSpins = localStorage.getItem('remainingSpins'); // 取得更新後的剩餘旋轉次數
    document.getElementById('remaining-count-backend').textContent = updatedRemainingSpins; // 更新顯示
  }
});

// ✅ 初始化畫面與按鈕監聽
function initializePage() {
  loadGuestLog();       // 載入來客數
  loadWinStats();       // 載入中獎資料
  loadRemainingSpins(); // 顯示剩餘旋轉次數

  document.getElementById("reset-spins-btn").addEventListener("click", () => {
    if (checkPassword()) {
      localStorage.setItem("remainingSpins", 2000); // 重設剩餘旋轉次數
      loadRemainingSpins(); // 更新畫面
      alert("前台旋轉次數已成功重設！");
    }
  });
}

// 只在頁面加載時呼叫一次初始化
window.onload = initializePage;

// 💾 儲存與讀取 localStorage 的工具
function getLocalStorageItem(key, defaultValue) {
  return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue)); // 取得 localStorage 的值，若不存在則回傳預設值
}

function setLocalStorageItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value)); // 儲存值到 localStorage
}

// 🔐 密碼驗證
function checkPassword() {
  const pw = prompt("請輸入密碼：");  // 提示使用者輸入密碼
  if (pw === PASSWORD) {
    return true;  // 密碼正確
  } else {
    alert("密碼錯誤");  // 提示密碼錯誤
    return false; // 密碼錯誤
  }
}
