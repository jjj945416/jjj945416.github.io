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
    if (remainingSpins <= 0) {
        alert("已達到最大旋轉次數！");
        return;
    }
    if (hasSpun) {
        alert("本輪已轉完，請重新整理頁面再試一次！");
        return;
    }
    hasSpun = true; // 設定為已旋轉

    const selectedDegree = 360 * 6 + Math.floor(Math.random() * 360) + 1; // 旋轉角度（6圈+隨機）
    pointer.style.transform = `translate(-50%, -100%) rotate(${selectedDegree}deg)`; // 設定旋轉效果

    // 更新剩餘次數
    remainingSpins--; // 次數減一
    localStorage.setItem('remainingSpins', remainingSpins); // 更新 localStorage 中的剩餘次數
    updateRemainingCount(); // 更新畫面顯示

    // 計算中獎區塊
    const currentWinnerIndex = Math.floor(selectedDegree % 360 / (360 / options.length)); // 計算中獎索引
    let winStats = JSON.parse(localStorage.getItem('winStats')) || new Array(options.length).fill(0);   // 讀取中獎次數
    winStats[currentWinnerIndex]++; // 增加中獎次數
    localStorage.setItem('winStats', JSON.stringify(winStats)); // 儲存中獎次數
});

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
