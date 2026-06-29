// projects.js

// 預留語系控制：未來想切換成中文版時，只需把這裡改成 'zh'
const CURRENT_LANG = 'en'; 

var GLOBAL_PROJECTS = [
    {
        id: "games202-homework2",
        date: "2026-06-29",
        featured: true,
        imgText: "games202-homework2",
        imgSrc: "assets/GAMES202_Homework2.png",
        title: {
            en: "Games202-homework2-PRT",
            zh: "Games202-homework2-PRT"
        },
        description: {
            en: "This project implements a real-time Precomputed Radiance Transfer (PRT) rendering pipeline. Leveraging Nori to precompute environment cubemap lighting and mesh transport data into Spherical Harmonics coefficients, it achieves dynamic, high-fidelity real-time global illumination and soft shadowing for complex OBJ models directly within a WebGL frame.",
            zh: "本項目實現了一個PRT渲染管線。利用 Nori 預計算Cubemap光源與Transfrer項，並將其轉化為球諧函數（Spherical Harmonics）係數，從而直接在 WebGL 框架內，為複雜的 OBJ 模型實現動態、高保真的即時全域照明（Global Illumination）與軟陰影效果。"
        },
        category: {
            en: "GAMES202",
            zh: "GAMES202"
        }
    },
];

// 語系防呆抓取函式
function getLangText(fieldObj) {
    return fieldObj[CURRENT_LANG] || fieldObj['en'];
}

/**
 * 全域自動渲染側邊欄函式 (已消除重複，全站共用)
 * @param {string} basePath - 如果是在子資料夾(如Articles)，傳入空字串 ""；如果是在根目錄，傳入 "Articles/"
 */
function initSidebar(basePath) {
    const categoriesContainer = document.getElementById("auto-categories");
    const featuredContainer = document.getElementById("auto-featured");
    
    if (!categoriesContainer && !featuredContainer) return;

    // 1. 自動計算分類數量
    const catCounts = {};
    GLOBAL_PROJECTS.forEach(p => {
        const catName = getLangText(p.category);
        catCounts[catName] = (catCounts[catName] || 0) + 1;
    });

    // 渲染分類
    if (categoriesContainer) {
        categoriesContainer.innerHTML = Object.keys(catCounts).map(cat => `
            <li><a href="${basePath ? '' : '../'}mywork.html?category=${encodeURIComponent(cat)}">${cat} (${catCounts[cat]})</a></li>
        `).join('');
    }

    // 2. 自動渲染精選文章
    if (featuredContainer) {
        const featuredPosts = GLOBAL_PROJECTS.filter(p => p.featured);
        featuredContainer.innerHTML = featuredPosts.map(p => {
            const fullTitle = getLangText(p.title);
            const shortTitle = fullTitle.split(' | ')[0];
            return `<li><a href="${basePath}post-${p.id}.html">${shortTitle}</a></li>`;
        }).join('');
    }
}