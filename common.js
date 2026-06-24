
async function loadComponent(elementId, filePath, callback, isSubPage=false) {
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            let html = await response.text();
            
            if (isSubPage) {
                html = html.replace(/href="(?!http|https|\/\/)/g, 'href="../');
            }

            document.getElementById(elementId).innerHTML = html;
            if (callback) callback();
        }
    } catch (e) { console.error(e); }
}


// 1. 初始化語系（default en）
if (!localStorage.getItem("CURRENT_LANG")) {
    localStorage.setItem("CURRENT_LANG", "en");
}

// 2. 全站共用：取得當前語系文字的防呆工具（供 projects.js 使用）
function getLangText(obj) {
    if (!obj) return "";
    const currentLang = localStorage.getItem("CURRENT_LANG");
    return obj[currentLang] || obj["en"] || ""; // 優先拿當前語系，沒有就拿英文
}

// 3. 全站共用：刷新全站「畫面上」的語系顯示
function updateGlobalLanguageDOM() {
    const currentLang = localStorage.getItem("CURRENT_LANG");

    // A. 切換畫面上帶有特定語系 class 的元件顯示隱藏
    document.querySelectorAll(".lang-zh").forEach(el => {
        el.style.display = (currentLang === "zh") ? "block" : "none";
    });
    document.querySelectorAll(".lang-en").forEach(el => {
        el.style.display = (currentLang === "en") ? "block" : "none";
    });

    // B. 更新右上角切換按鈕的文字狀態
    const langBtn = document.getElementById("global-lang-btn");
    if (langBtn) {
        langBtn.textContent = (currentLang === "zh") ? "EN" : "繁中";
    }
}

// 4. 全站共用：建立與綁定右上角切換按鈕
function setupLanguageSwitcher() {
    const langBtn = document.getElementById("global-lang-btn");

    if (!langBtn) return;

    // 2. 檢查有沒有綁定過點擊大腦（防止重複綁定）
    if (!langBtn.dataset.bound) {
        langBtn.addEventListener("click", () => {
            const oldLang = localStorage.getItem("CURRENT_LANG") || "zh";
            const newLang = (oldLang === "zh") ? "en" : "zh";
            localStorage.setItem("CURRENT_LANG", newLang);
            
            // 切換完畢，立刻重新整理網頁刷新語系
            window.location.reload(); 
        });
        langBtn.dataset.bound = "true"; // 做個綁定標記
    }

    // 3. 根據當前 localStorage 狀態更新按鈕文字與全站顯示
    const currentLang = localStorage.getItem("CURRENT_LANG") || "en";
    langBtn.textContent = (currentLang === "zh") ? "EN" : "繁中";

    // 呼叫顯示隱藏管理員
    updateGlobalLanguageDOM();
}
