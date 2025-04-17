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
/// 【初始化標籤】
function initLabels() {
    labelsContainer.innerHTML = ''; // 清空標籤容器
    const angleStep = 360 / options.length; // 每個標籤所佔角度
    console.log(`每個標籤佔角度: ${angleStep}°`); // 查看每個標籤角度

    // 遍歷每個獎項並建立標籤
    options.forEach((item, i) => {
        const label = document.createElement('div'); // 建立標籤 div
        label.className = 'label'; // 加入 label class
        const indexOffset = (i + 1) % options.length; // 計算偏移索引
        const angle = indexOffset * angleStep + angleStep / 2 - 18 + item.offset; // 計算標籤旋轉角度
        console.log(`標籤 ${i + 1}: 角度 = ${angle}°`); // 顯示每個標籤的角度

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

// 取得剩餘次數並更新畫面顯示的函式
function updateRemainingSpins() {
    // 從 localStorage 讀取剩餘次數，若無則設定為初始值 2000
    remainingSpins = parseInt(localStorage.getItem('remainingSpins')) || 2000;

    // 確保 remainingCount 變數正確初始化並更新畫面上的剩餘次數顯示
    const remainingCount = document.getElementById('remaining-count'); // 確保這是正確的元素 ID
    remainingCount.textContent = `剩餘次數: ${remainingSpins}`; // 顯示剩餘次數
}

// 更新畫面顯示剩餘次數的函式（只有一個，避免重複定義）
function updateRemainingCount() {
    const remainingCount = document.getElementById('remaining-count'); // 確保這是正確的元素 ID
    remainingCount.textContent = `${remainingSpins}`; // 顯示剩餘次數
}

// 旋轉按鈕的點擊事件
spinBtn.addEventListener('click', () => {
    // 若剩餘次數為 0，顯示警告並停止執行
    if (remainingSpins <= 0) {
        alert("已達到最大旋轉次數！");
        return;
    }

    // 防止連續點擊
    if (hasSpun) {
        alert("本輪已轉完，請重新整理頁面再試一次！");
        return;
    }

    // 設定為已旋轉，防止重複旋轉
    hasSpun = true;

    // 計算隨機選中的角度
    const selectedDegree = getWeightedRandomDegree();

    // 更新指針的旋轉角度
    pointer.style.transform = `translate(-50%, -100%) rotate(${selectedDegree}deg)`;    // 設定指針旋轉

    // 減少剩餘次數並更新 localStorage
    remainingSpins--;
    localStorage.setItem('remainingSpins', remainingSpins);  // 確保更新到 localStorage

    // 更新畫面上的剩餘次數顯示
    updateRemainingCount();

    // 更新中獎區間次數
const currentWinnerIndex = Math.floor(selectedDegree % 360 / (360 / options.length));   // 計算中獎區間索引

// 取得中獎次數陣列（若 localStorage 中沒有就初始化）
let winStats = JSON.parse(localStorage.getItem('winStats')) || new Array(options.length).fill(0);

// 將該區間的中獎次數 +1
winStats[currentWinnerIndex]++;

// 儲存更新後的中獎次數陣列到 localStorage
localStorage.setItem('winStats', JSON.stringify(winStats));

// ✅ 初始化獎項名稱陣列（只執行一次）
if (!localStorage.getItem('prizeLabels')) {
    localStorage.setItem('prizeLabels', JSON.stringify(options)); // 將目前獎項名稱陣列存入
}

});

// 🎯 加權機率與次數限制的中獎角度取得函式
function getWeightedRandomDegree() {
    const availableAngles = [];

    angleLimits.forEach((limit, index) => {
        if (angleHitCounts[index] < limit.maxHits) {
            const weight = limit.weight || 1;
            const granularity = 1000;
            for (let i = 0; i < weight * granularity; i++) {
                const degree = Math.floor(Math.random() * (limit.max - limit.min)) + limit.min;
                availableAngles.push({ degree, index });
            }
        }
    });

    if (availableAngles.length === 0) {
        alert("所有受限區間皆已達上限！");
        return Math.floor(Math.random() * 360);
    }

    const chosen = availableAngles[Math.floor(Math.random() * availableAngles.length)];
    angleHitCounts[chosen.index]++;
    localStorage.setItem('angleHitCounts', JSON.stringify(angleHitCounts));
    return 360 * 6 + chosen.degree + 1;
}


// 🔐 密碼驗證與管理頁面跳轉
const manageButton = document.getElementById('manage-button');
const passwordModal = document.getElementById('password-modal');
const passwordInput = document.getElementById('password-input');
const confirmPasswordBtn = document.getElementById('confirm-password');
const cancelPasswordBtn = document.getElementById('cancel-password');

// ➕ 開啟密碼視窗
manageButton.addEventListener('click', () => {
    passwordModal.style.display = 'flex';
    passwordInput.focus();
});

// ✅ 確認密碼事件
confirmPasswordBtn.addEventListener('click', verifyPassword);

// ❌ 取消輸入事件
cancelPasswordBtn.addEventListener('click', () => {
    passwordModal.style.display = 'none';
    passwordInput.value = '';
});

// 🖱️ 按 Enter 也可驗證密碼
passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        verifyPassword();
    }
});

// 🔒 密碼驗證函式
function verifyPassword() {
    const password = passwordInput.value.trim();
    if (password === 'nggchr') {
        alert('密碼正確，進入後台管理頁面');
        window.open('https://jjj945416.github.io/測試/後台.html', '_blank'); // ⬅️ 這裡改成另開一頁
    } else {
        alert('密碼錯誤，請再試一次');
        passwordInput.value = '';
    }
}
// ❌ 點擊外部關閉視窗
window.onload = function () {
    // 更新剩餘次數
    updateRemainingSpins();
    const spins = localStorage.getItem("remainingSpins") || 0;  // 取得剩餘旋轉次數
    document.getElementById("remaining-count").textContent = spins; // 顯示剩餘次數
  
    // 🔁 監聽來自後台的重設事件
    window.addEventListener('resetSpins', () => {
        const newCount = localStorage.getItem('remainingSpins');  // 取得新的剩餘旋轉次數
        document.getElementById("remaining-count").textContent = newCount;    // 更新顯示
    });
};

// ✅ 監聽自訂 syncData 事件，進行資料重新同步
window.addEventListener('syncData', () => {
    console.log('收到 syncData 事件，重新載入資料...');
    remainingSpins = parseInt(localStorage.getItem('remainingSpins')) || 2000;
    angleHitCounts = JSON.parse(localStorage.getItem('angleHitCounts')) || Array(angleLimits.length).fill(0);
    updateRemainingCount();
});

// ✅ 監聽 localStorage 被其他頁面改變時觸發（同步資料）
window.addEventListener('storage', (event) => {
    if (event.key === 'remainingSpins' || event.key === 'angleHitCounts') {
        console.log(`偵測到 ${event.key} 被更新，觸發 syncData`);
        window.dispatchEvent(new Event('syncData'));
    }
});
window.onload = function () {
    initLabels(); // 呼叫初始化標籤函式
    updateRemainingSpins(); // 更新剩餘次數
    const spins = localStorage.getItem("remainingSpins") || 0;
    document.getElementById("remaining-count").textContent = spins;
    // 其他初始化邏輯
};
