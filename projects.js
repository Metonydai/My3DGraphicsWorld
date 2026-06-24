// projects.js

// 預留語系控制：未來想切換成中文版時，只需把這裡改成 'zh'
const CURRENT_LANG = 'en'; 

var GLOBAL_PROJECTS = [
    {
        id: "ray-tracing",
        date: "2026-03-15",
        featured: true,
        imgText: "Vulkan PBR System Screenshot",
        title: {
            en: "Ray Tracing",
            zh: "Ray Tracing"
        },
        description: {
            en: "Focuses on the step-by-step evolution from the initial version to the final result, covering rendering pipeline architecture, descriptor set management, and the reasons behind performance optimizations.",
            zh: "主要集中分享「從最初版本，一步步到最後成果」的過程，會涉及渲染管線、描述符集管理，以及效能改動的原因。"
        },
        category: {
            en: "Vulkan",
            zh: "Vulkan"
        }
    },
    {
        id: "huiluna-game-engine",
        date: "2026-01-20",
        featured: false,
        imgText: "Ghibli Rendering Style Research",
        title: {
            en: "Creating 2D Ghibli-Style Trees and Geometric Effects in 3D",
            zh: "用 3D 製作 2D 吉卜力風格樹木與幾何特效"
        },
        description: {
            en: "Replicating 2D style in 3D isn't just about using a Toon Shader. To eliminate the 3D 'volumetric' look, you must start by modifying the 3D object's vertex normals and geometry shapes...",
            zh: "用 3D 來仿造 2D 風格，單單使用 Toon Shader 是「治標不治本」，要消除 3D 物件的立體感，就要從 3D 物件的頂點法線與形體下手……"
        },
        category: {
            en: "Blender / DCC",
            zh: "Blender / DCC"
        }
    },
    {
        id: "blender-do-it",
        date: "2026-04-10",
        featured: true,
        imgText: "Eevee Sci-Fi Scene Compositing",
        title: {
            en: "Crafting Sci-Fi Scenes with Eevee and After Effects | Workflow",
            zh: "用 Eevee 與 After Effect 製作科幻場景 | 流程分享"
        },
        description: {
            en: "Creating a sci-fi post-apocalyptic cyberpunk city animation loop using Blender Eevee and After Effects, experimenting with integrating Edge AI spatial computing into the DCC production pipeline.",
            zh: "用 Blender Eevee 配合 After effects 創作科幻後末日秩序城市背景動圖，嘗試加入 Edge AI 空間運算到製作過程中。"
        },
        category: {
            en: "Blender / DCC",
            zh: "Blender / DCC"
        }
    }
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