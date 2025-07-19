const svgCursor = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><line x1="16" y1="0" x2="16" y2="32" stroke="black" stroke-width="1.5"/><line x1="0" y1="16" x2="32" y2="16" stroke="black" stroke-width="1.5"/><rect x="20" y="20" width="10" height="10" fill="white" /><line x1="25" y1="21" x2="25" y2="29" stroke="black" stroke-width="2"/><line x1="21" y1="25" x2="29" y2="25" stroke="black" stroke-width="2"/></svg>`;
const customCopyCursor = `url('data:image/svg+xml;utf8,${encodeURIComponent(svgCursor)}') 16 16, copy`;
const HIGHLIGHT_CLASS = 'link-opener-highlighted-link';

const selectionState = {
  isActive: false,
  isSelecting: false,
  isCopyMode: false,
  selectionBox: null,
  style: 'classic-blue',
  startCoords: { x: 0, y: 0 },
  checkDuplicatesOnCopy: true,
  useHistory: false,
  linkHistory: [],
};

let highlightedElements = new Set();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type !== "initiateSelection" && request.type !== "initiateSelectionCopy") {
    return true;
  }

  const isCopyMode = request.type === "initiateSelectionCopy";
  const cursorStyle = isCopyMode ? customCopyCursor : 'crosshair';

  selectionState.checkDuplicatesOnCopy = request.checkDuplicatesOnCopy;
  selectionState.useHistory = request.useHistory;
  selectionState.linkHistory = request.linkHistory || [];
  selectionState.isCopyMode = isCopyMode;
  document.body.style.cursor = cursorStyle;

  if (selectionState.isActive) {
    sendResponse({ success: true, message: "Mode switched" });
    return true;
  }

  selectionState.isActive = true;
  selectionState.style = request.style;

  document.addEventListener('mousedown', handleMouseDown, true);
  document.addEventListener('keydown', handleKeyDown, true);

  sendResponse({ success: true, message: "Selection initiated" });
  return true;
});

function clearHighlights() {
  highlightedElements.forEach(el => el.classList.remove(HIGHLIGHT_CLASS));
  highlightedElements.clear();
}

function resetSelection() {
  if (selectionState.selectionBox) {
    selectionState.selectionBox.remove();
  }
  clearHighlights();
  document.body.style.cursor = 'default';

  document.removeEventListener('mousedown', handleMouseDown, true);
  document.removeEventListener('mousemove', handleMouseMove, true);
  document.removeEventListener('mouseup', handleMouseUp, true);
  document.removeEventListener('keydown', handleKeyDown, true);

  Object.assign(selectionState, {
    isActive: false,
    isSelecting: false,
    isCopyMode: false,
    selectionBox: null,
    startCoords: { x: 0, y: 0 },
    checkDuplicatesOnCopy: true,
    useHistory: false,
    linkHistory: [],
  });
}

function handleKeyDown(e) {
  if (e.key === 'Escape') {
    e.preventDefault();
    e.stopPropagation();
    resetSelection();
  }
}

function handleMouseDown(e) {
  if (e.button !== 0) return;

  e.preventDefault();
  e.stopPropagation();

  selectionState.isSelecting = true;
  selectionState.startCoords = { x: e.clientX, y: e.clientY };

  selectionState.selectionBox = document.createElement('div');
  selectionState.selectionBox.id = 'link-opener-selection-box';
  selectionState.selectionBox.className = selectionState.style;
  document.body.appendChild(selectionState.selectionBox);

  updateSelectionBox(e.clientX, e.clientY);

  document.addEventListener('mousemove', handleMouseMove, true);
  document.addEventListener('mouseup', handleMouseUp, true);
}

function updateLinkHighlights(clientRect) {
  const selectionRect = {
    left: clientRect.x,
    top: clientRect.y,
    right: clientRect.x + clientRect.width,
    bottom: clientRect.y + clientRect.height,
  };

  const newHighlightedElements = new Set();
  const historySet = new Set(selectionState.linkHistory);
  const seenInSelection = new Set();

  document.querySelectorAll('a[href]').forEach(link => {
    const r = link.getBoundingClientRect();
    const isInSelection = r.width > 0 && r.height > 0 &&
      r.left < selectionRect.right && r.right > selectionRect.left &&
      r.top < selectionRect.bottom && r.bottom > selectionRect.top;

    if (!isInSelection) return;

    const href = link.href;
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    if (!selectionState.isCopyMode) {
      if (seenInSelection.has(href) || (selectionState.useHistory && historySet.has(href))) {
        return;
      }
    } else {
      if (selectionState.checkDuplicatesOnCopy && seenInSelection.has(href)) {
        return;
      }
    }

    newHighlightedElements.add(link);

    if (!selectionState.isCopyMode || selectionState.checkDuplicatesOnCopy) {
      seenInSelection.add(href);
    }
  });

  highlightedElements.forEach(el => {
    if (!newHighlightedElements.has(el)) {
      el.classList.remove(HIGHLIGHT_CLASS);
    }
  });

  newHighlightedElements.forEach(el => {
    if (!highlightedElements.has(el)) {
      el.classList.add(HIGHLIGHT_CLASS);
    }
  });

  highlightedElements = newHighlightedElements;
}

function handleMouseMove(e) {
  if (!selectionState.isSelecting) return;
  const currentCoords = { x: e.clientX, y: e.clientY };
  updateSelectionBox(currentCoords.x, currentCoords.y);
  const rect = getSelectionRectangle(selectionState.startCoords, currentCoords);
  updateLinkHighlights(rect);
}

function handleMouseUp(e) {
  if (e.button !== 0) return;

  e.preventDefault();
  e.stopPropagation();

  const endCoords = { x: e.clientX, y: e.clientY };
  const selectionRect = getSelectionRectangle(selectionState.startCoords, endCoords);

  if (selectionRect.width > 5 && selectionRect.height > 5) {
    let links = getLinksInArea(selectionRect);

    if (links.length > 0) {
      if (selectionState.isCopyMode) {
        if (selectionState.checkDuplicatesOnCopy) {
          links = [...new Set(links)];
        }
        copyLinksToClipboard(links);
      } else {
        chrome.runtime.sendMessage({ type: "openLinks", urls: links });
      }
    }
  }
  resetSelection();
}

function updateSelectionBox(currentX, currentY) {
  if (!selectionState.selectionBox) return;
  const rect = getSelectionRectangle(selectionState.startCoords, { x: currentX, y: currentY });

  Object.assign(selectionState.selectionBox.style, {
    left: `${rect.x}px`,
    top: `${rect.y}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`
  });
}

function getSelectionRectangle(start, end) {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const width = Math.abs(start.x - end.x);
  const height = Math.abs(start.y - end.y);
  return { x, y, width, height };
}

function getLinksInArea(clientRect) {
  const selectionRect = {
    left: clientRect.x,
    top: clientRect.y,
    right: clientRect.x + clientRect.width,
    bottom: clientRect.y + clientRect.height
  };

  return Array.from(document.querySelectorAll('a[href]'))
    .filter(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
        return false;
      }
      const r = link.getBoundingClientRect();
      return r.width > 0 && r.height > 0 &&
             r.left < selectionRect.right && r.right > selectionRect.left &&
             r.top < selectionRect.bottom && r.bottom > selectionRect.top;
    })
    .map(link => link.href);
}

function copyLinksToClipboard(links) {
  const text = links.join('\n');

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Area Links: Could not copy text.', err);
    });
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Area Links: Fallback copy method failed.', err);
    }
    document.body.removeChild(textarea);
  }
}