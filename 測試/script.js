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
const pointer = document.getElementById('pointer');  // 取得指針元素
const spinBtn = document.getElementById('spin-btn'); // 取得旋轉按鈕
const labelsContainer = document.getElementById('labels'); // 取得標籤容器
const remainingCountElement = document.getElementById('remaining-count'); // 取得剩餘次數顯示元素
let hasSpun = false; // 設定初始旋轉狀態為未旋轉
let remainingSpins = 2000; // 初始剩餘旋轉次數

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
            } else if (i === 6) {
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
            } else {
                label.textContent = item.text; // 其他正常顯示
            }
        }

        labelsContainer.appendChild(label); // 加入容器
    });
}

// 【頁面載入後初始化】
window.addEventListener('load', () => {
    remainingSpins = localStorage.getItem('remainingSpins') ? parseInt(localStorage.getItem('remainingSpins')) : 2000; // 從 localStorage 取得次數
    updateRemainingCount(); // 顯示次數
    initLabels(); // 初始化標籤
});

// 【更新剩餘次數】
function updateRemainingCount() {
    remainingCountElement.textContent = `${remainingSpins}`; // 顯示剩餘次數
}
// 監聽 'syncData' 事件並更新前台資料
window.addEventListener('syncData', () => {     // 當事件觸發時執行
    const remainingSpins = localStorage.getItem('remainingSpins');  // 取得剩餘次數
    // 更新前台顯示的旋轉次數  
    document.getElementById('remaining-spins').textContent = remainingSpins || 2000;    // 如果沒有則顯示預設值
});
// 【旋轉事件】
spinBtn.addEventListener('click', () => {
    if (remainingSpins <= 0) {
        alert("已達到最大旋轉次數！");
        return;
    }

    if (hasSpun) {
        alert("本輪已轉完，請重新整理頁面再試一次！");
        return;
    }

    hasSpun = true;

    const selectedDegree = 360 * 5 + Math.floor(Math.random() * 360) + 1; // 計算隨機角度
    pointer.style.transform = `translate(-50%, -100%) rotate(${selectedDegree}deg)`; // 執行旋轉

    remainingSpins--; // 減少次數
    updateRemainingCount(); // 更新顯示
    localStorage.setItem('remainingSpins', remainingSpins); // 存入本地
});

// 【管理頁面密碼驗證】
const manageButton = document.getElementById('manage-button'); // 取得管理按鈕
const passwordModal = document.getElementById('password-modal'); // 取得密碼模態框
const passwordInput = document.getElementById('password-input'); // 取得密碼輸入欄
const confirmPasswordBtn = document.getElementById('confirm-password'); // 確認按鈕
const cancelPasswordBtn = document.getElementById('cancel-password'); // 取消按鈕

// 開啟密碼視窗
manageButton.addEventListener('click', () => {
    passwordModal.style.display = 'flex'; // 顯示模態視窗
    passwordInput.focus(); // 自動聚焦
});

// 確認密碼事件
confirmPasswordBtn.addEventListener('click', verifyPassword);

// 取消密碼輸入事件
cancelPasswordBtn.addEventListener('click', () => {
    passwordModal.style.display = 'none'; // 關閉視窗
    passwordInput.value = ''; // 清空
});

// 輸入密碼按下 Enter 可提交
passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        verifyPassword();
    }
});

// 密碼驗證函式
function verifyPassword() {
    const inputPassword = passwordInput.value.toLowerCase(); // 取得並轉小寫
    const correctPassword = 'nggchr'; // 預設密碼

    if (inputPassword === correctPassword) {
        window.location.href = 'https://jjj945416.github.io/後台.html'; // 跳轉後台頁
    } else {
        alert('密碼錯誤，請重新輸入！');
        passwordInput.value = ''; // 清空
        passwordInput.focus(); // 聚焦
    }
}
