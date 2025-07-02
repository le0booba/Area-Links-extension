let isSelectionModeActive = false;
let isSelecting = false;
let startCoords = { x: 0, y: 0 };
let selectionBox = null;
let currentSelectionStyle = 'classic-blue';
let isCopyMode = false;
let lastSelectedLinks = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "initiateSelection" || request.type === "initiateSelectionCopy") {
    isSelectionModeActive = true;
    isCopyMode = request.type === "initiateSelectionCopy";
    document.body.style.cursor = 'crosshair';
    currentSelectionStyle = request.style;
    sendResponse({ success: true });
  }

  if (request.type === "copyLastSelectedLinks") {
    if (lastSelectedLinks.length) {
      copyLinksToClipboard(lastSelectedLinks);
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false });
    }
  }

  return true;
});

document.addEventListener('mousedown', e => {
  if (e.button !== 0 || !isSelectionModeActive) return;
  
  e.preventDefault();
  isSelecting = true;
  startCoords = { x: e.clientX, y: e.clientY };
  
  if (!selectionBox) {
    selectionBox = document.createElement('div');
    selectionBox.id = 'link-opener-selection-box';
    selectionBox.className = currentSelectionStyle;
    document.body.appendChild(selectionBox);
  }
  
  updateSelectionBox(e);
});

document.addEventListener('mousemove', e => {
  if (!isSelecting) return;
  updateSelectionBox(e);
});

document.addEventListener('mouseup', async e => {
  if (e.button !== 0 || !isSelecting) return;
  
  isSelecting = false;
  isSelectionModeActive = false;
  document.body.style.cursor = 'default';
  
  const endCoords = { x: e.clientX, y: e.clientY };
  const selectionRect = {
    left: Math.min(startCoords.x, endCoords.x),
    top: Math.min(startCoords.y, endCoords.y),
    right: Math.max(startCoords.x, endCoords.x),
    bottom: Math.max(startCoords.y, endCoords.y)
  };
  
  if (selectionBox) {
    document.body.removeChild(selectionBox);
    selectionBox = null;
  }
  
  if (selectionRect.right - selectionRect.left > 5 && selectionRect.bottom - selectionRect.top > 5) {
    let links = getLinksInArea(selectionRect);
    lastSelectedLinks = links.slice();
    
    if (isCopyMode) {
      if (links.length) {
        const settings = await chrome.storage.sync.get(['checkDuplicatesOnCopy']);
        const { checkDuplicatesOnCopy = true } = settings;
        if (checkDuplicatesOnCopy) {
          links = Array.from(new Set(links));
        }
        copyLinksToClipboard(links);
      }
    } else if (links.length) {
      chrome.runtime.sendMessage({ type: "openLinks", urls: links });
    }
  }
});

function updateSelectionBox(e) {
  const { x, y } = e;
  const left = Math.min(startCoords.x, x);
  const top = Math.min(startCoords.y, y);
  const width = Math.abs(startCoords.x - x);
  const height = Math.abs(startCoords.y - y);
  
  Object.assign(selectionBox.style, {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`
  });
}

function getLinksInArea(rect) {
  return Array.from(document.querySelectorAll('a[href]'))
    .filter(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return false;
      
      const r = link.getBoundingClientRect();
      return (
        r.width > 0 &&
        r.height > 0 &&
        r.left < rect.right &&
        r.right > rect.left &&
        r.top < rect.bottom &&
        r.bottom > rect.top
      );
    })
    .map(link => link.href);
}

function copyLinksToClipboard(links) {
  const text = links.join('\n');
  
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try { 
      document.execCommand('copy'); 
    } catch {}
    
    document.body.removeChild(textarea);
  }
}