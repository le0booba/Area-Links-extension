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
    if (lastSelectedLinks.length > 0) {
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

document.addEventListener('mouseup', e => {
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
  if (
    selectionRect.right - selectionRect.left > 5 &&
    selectionRect.bottom - selectionRect.top > 5
  ) {
    if (isCopyMode) {
      const links = findLinksInArea(selectionRect);
      lastSelectedLinks = links.slice();
      if (links.length > 0) {
        copyLinksToClipboard(links);
      }
    } else {
      findAndSendLinks(selectionRect);
    }
  }
});

function updateSelectionBox(e) {
  const currentCoords = { x: e.clientX, y: e.clientY };
  const left = Math.min(startCoords.x, currentCoords.x);
  const top = Math.min(startCoords.y, currentCoords.y);
  const width = Math.abs(startCoords.x - currentCoords.x);
  const height = Math.abs(startCoords.y - currentCoords.y);
  selectionBox.style.left = `${left}px`;
  selectionBox.style.top = `${top}px`;
  selectionBox.style.width = `${width}px`;
  selectionBox.style.height = `${height}px`;
}

function findAndSendLinks(selectionRect) {
  const allLinks = document.querySelectorAll('a[href]');
  const linksInArea = [];
  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
    const linkRect = link.getBoundingClientRect();
    if (
      linkRect.width > 0 &&
      linkRect.height > 0 &&
      linkRect.left < selectionRect.right &&
      linkRect.right > selectionRect.left &&
      linkRect.top < selectionRect.bottom &&
      linkRect.bottom > selectionRect.top
    ) {
      linksInArea.push(link.href);
    }
  });
  lastSelectedLinks = linksInArea.slice();
  if (linksInArea.length > 0) {
    chrome.runtime.sendMessage({ type: "openLinks", urls: linksInArea });
  }
}

function findLinksInArea(selectionRect) {
  const allLinks = document.querySelectorAll('a[href]');
  const linksInArea = [];
  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
    const linkRect = link.getBoundingClientRect();
    if (
      linkRect.width > 0 &&
      linkRect.height > 0 &&
      linkRect.left < selectionRect.right &&
      linkRect.right > selectionRect.left &&
      linkRect.top < selectionRect.bottom &&
      linkRect.bottom > selectionRect.top
    ) {
      linksInArea.push(link.href);
    }
  });
  return linksInArea;
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