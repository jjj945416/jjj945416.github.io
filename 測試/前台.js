// 【獎項設定】共10格，每格36度
const options = [
    { text: "住宿優惠券", offset: 13 },
    { text: "擊球優惠劵", offset: 1 },
    { text: "餐飲折扣劵", offset: 12 },
    { text: "擊球優惠劵", offset: 12 },
    { text: "餐飲折扣劵", offset: 12 },
    { text: "擊球優惠劵", offset: 12 },
    { text: "餐飲折扣劵", offset: 13 },
    { text: "擊球優惠劵", offset: 13 },
    { text: "餐飲折扣劵", offset: 15 },
    { text: "餐飲折扣劵", offset: 17 }
];

// 【DOM元素取得】
const spinBtn = document.getElementById('spin-btn'); // 確保這是你的旋轉按鈕的 ID
const pointer = document.getElementById('pointer'); // 確保這是你的指針元素的 ID
const labelsContainer = document.getElementById('labels'); // 確保這裡是正確的元素
const remainingCountElement = document.getElementById('remaining-count'); // 取得剩餘次數顯示元素
let remainingSpins = parseInt(localStorage.getItem('remainingSpins')) || 2000; // 預設為 2000
let hasSpun = false; // 確保 hasSpun 是未旋轉狀態

// 【初始化標籤】
function initLabels() {
    labelsContainer.innerHTML = ''; // 清空標籤容器
    const angleStep = 360 / options.length; // 每個標籤所佔角度

    // 遍歷每個獎項並建立標籤
    options.forEach((item, i) => {
        const label = document.createElement('div'); // 建立標籤 div
        label.className = 'label'; // 加入 label class
        const indexOffset = (i + 1) % options.length; // 計算偏移索引
        const angle = indexOffset * angleStep + angleStep / 2 - 18 + item.offset; // 計算標籤旋轉角度

        // 處理特殊標籤的顯示方式
        if (i === 1) {
            label.style.transform = `rotate(${angle}deg) translate(0, 0px)`; // 設定旋轉與位置
            const span = document.createElement('span'); // 建立包字容器
            span.style.display = 'inline-block';
            span.style.transform = 'rotate(283deg)'; // 整段旋轉
            const chars = item.text.split(''); // 分割每個字
            chars.forEach(char => {
                const charSpan = document.createElement('span'); // 為每個字建立 span
                charSpan.textContent = char; // 加入字內容
                charSpan.style.display = 'block';   // 設定為區塊顯示
                charSpan.style.lineHeight = '1'; // 設定行高為1
                charSpan.style.margin = '0';    // 設定外距為0
                charSpan.style.padding = '0';   // 設定內距為0
                span.appendChild(charSpan); // 加入 span 容器
            });
            label.appendChild(span); // 加入標籤
        } else {
            label.style.setProperty('--angle', `${angle}deg`); // 設定角度樣式
            if ([2, 3, 4, 5].includes(i)) { // 如果是第2、3、4、5個獎項
                const span = document.createElement('span'); // 建立 span
                span.textContent = item.text; // 加入文字
                span.style.display = 'inline-block';
                span.style.transform = 'scale(-1, -1)'; // 反轉文字
                label.appendChild(span); // 加入標籤
            } else if (i === 6) { // 如果是第 6 個獎項
                const span = document.createElement('span');    // 建立 span
                span.style.display = 'inline-block';    // 設定顯示為區塊
                span.style.transform = 'scale(-1, -1)'; // 反轉文字
                item.text.split('').forEach(char => {   // 分割字元
                    const charSpan = document.createElement('span');    // 建立字元 span
                    charSpan.textContent = char;        // 加入字內容
                    charSpan.style.display = 'inline-block';    // 設定為區塊顯示
                    charSpan.style.transform = 'rotate(-90deg)'; // 單字旋轉
                    span.appendChild(charSpan); // 加入字元容器
                });
                label.appendChild(span);    // 加入標籤
            } else { // 其他標籤，正常顯示
                label.textContent = item.text; // 其他正常顯示
            }
        }

        labelsContainer.appendChild(label); // 加入容器
    });
}
// 各區間的角度範圍、最大次數、權重設定
const angleLimits = [
    { min: 0, max: 37, maxHits: Infinity, weight: 2 },
    { min: 37, max: 74, maxHits: Infinity, weight: 3 },
    { min: 74, max: 111, maxHits: Infinity, weight: 3 },
    { min: 111, max: 148, maxHits: Infinity, weight: 2 },
    { min: 148, max: 175, maxHits: 20, weight: 0.24 }, // 限制中獎次數
    { min: 175, max: 212, maxHits: Infinity, weight: 3 },
    { min: 212, max: 249, maxHits: Infinity, weight: 2 },
    { min: 249, max: 286, maxHits: Infinity, weight: 3 },
    { min: 286, max: 323, maxHits: Infinity, weight: 3 },
    { min: 323, max: 360, maxHits: Infinity, weight: 3 }
  ];
  
  // 每區中獎次數（從 localStorage 取出或初始化）
  let angleHitCounts = JSON.parse(localStorage.getItem('angleHitCounts')) || Array(angleLimits.length).fill(0);

// 【本地儲存】取得與設定函式
function updateRemainingSpins() {
    remainingSpins = parseInt(localStorage.getItem('remainingSpins')) || 2000;
    updateRemainingCount();  // 更新畫面
}

// 🔁 更新剩餘次數顯示
function updateRemainingCount() {
    if (remainingCountElement) {
        remainingCountElement.textContent = remainingSpins;  // 顯示剩餘次數
    }
}

// 🎯 頁面載入時初始化資料
window.addEventListener('load', () => {
    updateRemainingSpins();  // 初始化剩餘次數
    initLabels();  // 初始化標籤
});

// 🎰 點擊旋轉按鈕的事件
spinBtn.addEventListener('click', () => {
    if (remainingSpins <= 0) {  // 檢查剩餘次數
        alert("已達到最大旋轉次數！");  // 提示已達到最大旋轉次數
        return; // 結束函式
    }
    if (hasSpun) {  // 檢查是否已經旋轉過
        alert("本輪已轉完，請重新整理頁面再試一次！");  // 提示已經旋轉過
        return; // 結束函式
    }
    hasSpun = true; // 設定為已旋轉狀態

    // ✅ 使用自訂函式取得符合限制的角度 
    const selectedDegree = getWeightedRandomDegree();   // 取得隨機角度
    pointer.style.transform = `translate(-50%, -100%) rotate(${selectedDegree}deg)`;    // 設定指針旋轉角度

    // 更新剩餘次數
    remainingSpins--;   // 減少剩餘次數
    localStorage.setItem('remainingSpins', remainingSpins); // 儲存剩餘次數
    updateRemainingCount(); // 更新畫面

    // 計算中獎區塊
    const currentWinnerIndex = Math.floor(selectedDegree % 360 / (360 / options.length));   // 計算中獎區塊索引
    let winStats = JSON.parse(localStorage.getItem('winStats')) || new Array(options.length).fill(0);   // 取得中獎統計資料
    winStats[currentWinnerIndex]++; // 增加中獎次數
    localStorage.setItem('winStats', JSON.stringify(winStats)); // 儲存中獎統計資料
});

// 🎯 加權機率與次數限制的中獎角度取得函式
function getWeightedRandomDegree() {    // 取得隨機角度
    const availableAngles = []; // 可用的角度陣列

    angleLimits.forEach((limit, index) => { // 遍歷每個限制
        if (angleHitCounts[index] < limit.maxHits) {    // 檢查中獎次數是否小於上限
            const weight = limit.weight || 1;   // 取得權重
            for (let i = 0; i < weight * 100; i++) { // 乘100增加權重粒度   
                const degree = Math.floor(Math.random() * (limit.max - limit.min)) + limit.min; // 隨機產生角度
                availableAngles.push({ degree, index });    // 加入可用角度
            }
        }
    });

    if (availableAngles.length === 0) { // 如果沒有可用的角度
        alert("所有受限區間皆已達上限！");  // 提示所有區間已達上限
        return Math.floor(Math.random() * 360); // 回傳隨機角度作為備案
    }

    const chosen = availableAngles[Math.floor(Math.random() * availableAngles.length)];
    angleHitCounts[chosen.index]++;
    localStorage.setItem('angleHitCounts', JSON.stringify(angleHitCounts)); // 儲存次數
    return 360 * 6 + chosen.degree + 1; // 確保轉6圈 + 中獎角度
}
// 更新後台資料（這裡可以根據實際需求進行調整）
// 發送同步事件
const syncEvent = new Event('syncData');
window.dispatchEvent(syncEvent);

// 🔐 密碼驗證與管理頁面跳轉（無變更，保留原來的邏輯）
const manageButton = document.getElementById('manage-button'); // 管理按鈕
const passwordModal = document.getElementById('password-modal'); // 密碼輸入視窗
const passwordInput = document.getElementById('password-input'); // 密碼輸入框
const confirmPasswordBtn = document.getElementById('confirm-password'); // 確認按鈕
const cancelPasswordBtn = document.getElementById('cancel-password'); // 取消按鈕

// ➕ 開啟密碼視窗
manageButton.addEventListener('click', () => {
    passwordModal.style.display = 'flex'; // 顯示密碼視窗
    passwordInput.focus(); // 自動聚焦輸入框
});

// ✅ 確認密碼事件
confirmPasswordBtn.addEventListener('click', verifyPassword);

// ❌ 取消輸入事件
cancelPasswordBtn.addEventListener('click', () => {
    passwordModal.style.display = 'none'; // 關閉視窗
    passwordInput.value = ''; // 清空輸入
});

// 🖱️ 按 Enter 也可驗證密碼
passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        verifyPassword();
    }
});

// 密碼驗證邏輯
function verifyPassword() {
    const password = passwordInput.value.trim(); // 取得輸入的密碼
    if (password === 'nggchr') { // 密碼驗證邏輯（可以自訂）
        alert('密碼正確，進入後台管理頁面');
        window.location.href = 'https://jjj945416.github.io/後台.html'; // 跳轉到管理頁面
    } else {
        alert('密碼錯誤，請再試一次');
        passwordInput.value = ''; // 清空密碼輸入框
    }
}
// 🛠️ 監聽後台頁面發送的 resetSpins 事件
window.addEventListener('resetSpins', () => {
    updateRemainingSpins();  // 重新從 localStorage 取得並更新剩餘次數
    hasSpun = false;  // 可選：重設旋轉狀態，防止使用者誤點擊
});

// 🛠️ 更新剩餘次數顯示的函式
function updateRemainingSpins() {
    remainingSpins = parseInt(localStorage.getItem('remainingSpins')) || 2000;
    updateRemainingCount();  // 更新顯示的剩餘次數
}

// 🛠️ 更新畫面顯示的剩餘次數
function updateRemainingCount() {
    const remainingCountElement = document.getElementById('remaining-count');
    if (remainingCountElement) {
        remainingCountElement.textContent = remainingSpins;  // 顯示剩餘次數
    }
}
