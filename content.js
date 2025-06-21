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

// --- Логика активации ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleSelectionMode") {
        isSelectionModeActive = !isSelectionModeActive;
        document.body.style.cursor = isSelectionModeActive ? 'crosshair' : 'default';
        if (isSelectionModeActive) {
            document.addEventListener('mousedown', handleMouseDown, { once: true });
        } else {
            document.removeEventListener('mousedown', handleMouseDown);
        }
    }
});

// --- Логика рисования ---
function handleMouseDown(e) {
    if (!isSelectionModeActive || e.button !== 0) {
        isSelectionModeActive = false;
        document.body.style.cursor = 'default';
        return;
    }
    
    e.preventDefault();
    e.stopPropagation();

    // **НОВОЕ ИСПРАВЛЕНИЕ:** Принудительно убираем любое существующее выделение текста.
    // Это гарантирует, что действие расширения всегда будет иметь приоритет.
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else if (document.selection) { // Для старых версий IE (на всякий случай)
        document.selection.empty();
    }

    document.body.style.userSelect = 'none';

    startX = e.clientX;
    startY = e.clientY;

    selectionBox = document.createElement('div');
    selectionBox.className = 'selection-box-by-dev';
    selectionBox.classList.add(userSettings.selectionStyle);
    document.body.appendChild(selectionBox);
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp, { once: true });
}

function handleMouseMove(e) {
    e.preventDefault();
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
    window.removeEventListener('mousemove', handleMouseMove);
    document.body.style.userSelect = '';
    isSelectionModeActive = false;
    document.body.style.cursor = 'default';

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