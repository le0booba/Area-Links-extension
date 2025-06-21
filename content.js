let isSelectionModeActive = false;
let selectionBox = null;
let startX = 0;
let startY = 0;
let userSettings = {
    maxTabs: 15,
    selectionStyle: 'style-default'
};

// --- Инициализация и загрузка настроек ---
chrome.storage.sync.get({ maxTabs: 15, selectionStyle: 'style-default' }, (settings) => {
    userSettings = settings;
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        if (changes.maxTabs) userSettings.maxTabs = changes.maxTabs.newValue;
        if (changes.selectionStyle) userSettings.selectionStyle = changes.selectionStyle.newValue;
    }
});

// --- Функции для предотвращения выделения текста ---
function preventTextSelection() {
    // Убираем любое существующее выделение
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else if (document.selection) {
        document.selection.empty();
    }
    
    // Отключаем выделение текста для всей страницы
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    
    // Добавляем CSS класс для дополнительной защиты
    document.body.classList.add('selection-mode-active');
}

function restoreTextSelection() {
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    document.body.style.mozUserSelect = '';
    document.body.style.msUserSelect = '';
    document.body.classList.remove('selection-mode-active');
}

// Обработчик для предотвращения выделения во время активного режима
function preventSelectionEvents(e) {
    if (isSelectionModeActive) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}

// --- Логика активации ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleSelectionMode") {
        isSelectionModeActive = !isSelectionModeActive;
        
        if (isSelectionModeActive) {
            // Активируем режим выделения
            preventTextSelection();
            
            // Добавляем обработчики для предотвращения выделения текста
            document.addEventListener('selectstart', preventSelectionEvents, true);
            document.addEventListener('mousedown', preventSelectionEvents, true);
            document.addEventListener('dragstart', preventSelectionEvents, true);
            
            // Добавляем основной обработчик mousedown с небольшой задержкой
            setTimeout(() => {
                if (isSelectionModeActive) {
                    document.addEventListener('mousedown', handleMouseDown, { once: true, capture: true });
                }
            }, 50);
        } else {
            // Деактивируем режим выделения
            restoreTextSelection();
            
            // Убираем все обработчики
            document.removeEventListener('selectstart', preventSelectionEvents, true);
            document.removeEventListener('mousedown', preventSelectionEvents, true);
            document.removeEventListener('dragstart', preventSelectionEvents, true);
            document.removeEventListener('mousedown', handleMouseDown, true);
        }
    }
});

// --- Логика рисования ---
function handleMouseDown(e) {
    if (!isSelectionModeActive || e.button !== 0) {
        isSelectionModeActive = false;
        restoreTextSelection();
        return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // Дополнительно убираем выделение
    preventTextSelection();

    startX = e.clientX;
    startY = e.clientY;

    selectionBox = document.createElement('div');
    selectionBox.className = 'selection-box-by-dev';
    selectionBox.classList.add(userSettings.selectionStyle);
    document.body.appendChild(selectionBox);
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;

    window.addEventListener('mousemove', handleMouseMove, { capture: true });
    window.addEventListener('mouseup', handleMouseUp, { once: true, capture: true });
    
    return false;
}

function handleMouseMove(e) {
    if (!isSelectionModeActive || !selectionBox) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const currentX = e.clientX;
    const currentY = e.clientY;

    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    const newX = Math.min(currentX, startX);
    const newY = Math.min(currentY, startY);

    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;
    selectionBox.style.left = `${newX}px`;
    selectionBox.style.top = `${newY}px`;
}

function handleMouseUp(e) {
    window.removeEventListener('mousemove', handleMouseMove, { capture: true });
    
    // Восстанавливаем возможность выделения текста
    restoreTextSelection();
    isSelectionModeActive = false;
    
    // Убираем обработчики для предотвращения выделения
    document.removeEventListener('selectstart', preventSelectionEvents, true);
    document.removeEventListener('mousedown', preventSelectionEvents, true);
    document.removeEventListener('dragstart', preventSelectionEvents, true);

    if (selectionBox) {
        const rect = selectionBox.getBoundingClientRect();
        if (rect.width > 5 || rect.height > 5) {
            findAndProcessLinks(rect);
        }
        document.body.removeChild(selectionBox);
        selectionBox = null;
    }
}

// --- Обработка ссылок (без изменений) ---
function findAndProcessLinks(selectionRect) {
    const allLinksOnPage = document.querySelectorAll('a[href]');
    const linksInSelection = [];

    for (const link of allLinksOnPage) {
        const linkRect = link.getBoundingClientRect();
        const isIntersecting = !(linkRect.right < selectionRect.left || linkRect.left > selectionRect.right || linkRect.bottom < selectionRect.top || linkRect.top > selectionRect.bottom);
        if (isIntersecting && link.offsetParent !== null) {
            linksInSelection.push(link);
        }
    }

    linksInSelection.sort((a, b) => {
        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();
        if (rectA.top !== rectB.top) {
            return rectA.top - rectB.top;
        }
        return rectA.left - rectB.left;
    });

    const filteredUrls = linksInSelection.map(link => {
        const url = link.href;
        if (!url || !url.startsWith('http')) return null;
        return url;
    }).filter(url => url !== null);

    const uniqueLinks = [...new Set(filteredUrls)];
    const limitedLinks = uniqueLinks.slice(0, userSettings.maxTabs);

    if (uniqueLinks.length > limitedLinks.length) {
        alert(`Found ${uniqueLinks.length} unique links.\nOpening the first ${userSettings.maxTabs} in order, as per your settings.`);
    }

    if (limitedLinks.length > 0) {
        chrome.runtime.sendMessage({ action: 'openLinks', urls: limitedLinks });
    }
}