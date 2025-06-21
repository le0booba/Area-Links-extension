let isSelectionModeActive = false;
let selectionBox = null;
let startX = 0;
let startY = 0;
let userSettings = { maxTabs: 15, selectionStyle: 'style-default' };

// Load settings on init
chrome.storage.sync.get({ maxTabs: 15, selectionStyle: 'style-default' }, (settings) => {
  userSettings = settings;
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.maxTabs) userSettings.maxTabs = changes.maxTabs.newValue;
    if (changes.selectionStyle) userSettings.selectionStyle = changes.selectionStyle.newValue;
  }
});

// Prevent text selection functions
function preventTextSelection() {
  // Clear any existing selection
  const selection = window.getSelection ? window.getSelection() : document.selection;
  if (selection) {
    selection.removeAllRanges ? selection.removeAllRanges() : selection.empty();
  }
  
  // Disable text selection
  const styles = ['userSelect', 'webkitUserSelect', 'mozUserSelect', 'msUserSelect'];
  styles.forEach(style => { document.body.style[style] = 'none'; });
  
  document.body.classList.add('selection-mode-active');
}

function restoreTextSelection() {
  const styles = ['userSelect', 'webkitUserSelect', 'mozUserSelect', 'msUserSelect'];
  styles.forEach(style => { document.body.style[style] = ''; });
  document.body.classList.remove('selection-mode-active');
}

// Event handler to prevent selection during active mode
function preventSelectionEvents(e) {
  if (isSelectionModeActive) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}

// Toggle selection mode
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "toggleSelectionMode") {
    isSelectionModeActive = !isSelectionModeActive;
    
    if (isSelectionModeActive) {
      preventTextSelection();
      
      // Add event listeners to prevent text selection
      const events = ['selectstart', 'mousedown', 'dragstart'];
      events.forEach(event => {
        document.addEventListener(event, preventSelectionEvents, true);
      });
      
      // Add main mousedown handler with delay
      setTimeout(() => {
        if (isSelectionModeActive) {
          document.addEventListener('mousedown', handleMouseDown, { once: true, capture: true });
        }
      }, 50);
    } else {
      restoreTextSelection();
      
      // Remove all event listeners
      const events = ['selectstart', 'mousedown', 'dragstart'];
      events.forEach(event => {
        document.removeEventListener(event, preventSelectionEvents, true);
      });
      document.removeEventListener('mousedown', handleMouseDown, true);
    }
  }
});

// Mouse event handlers
function handleMouseDown(e) {
  if (!isSelectionModeActive || e.button !== 0) {
    isSelectionModeActive = false;
    restoreTextSelection();
    return;
  }
  
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  preventTextSelection();

  startX = e.clientX;
  startY = e.clientY;

  selectionBox = document.createElement('div');
  selectionBox.className = `selection-box-by-dev ${userSettings.selectionStyle}`;
  Object.assign(selectionBox.style, {
    left: `${startX}px`,
    top: `${startY}px`
  });
  document.body.appendChild(selectionBox);

  window.addEventListener('mousemove', handleMouseMove, { capture: true });
  window.addEventListener('mouseup', handleMouseUp, { once: true, capture: true });
  
  return false;
}

function handleMouseMove(e) {
  if (!isSelectionModeActive || !selectionBox) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  const width = Math.abs(e.clientX - startX);
  const height = Math.abs(e.clientY - startY);
  const left = Math.min(e.clientX, startX);
  const top = Math.min(e.clientY, startY);

  Object.assign(selectionBox.style, {
    width: `${width}px`,
    height: `${height}px`,
    left: `${left}px`,
    top: `${top}px`
  });
}

function handleMouseUp() {
  window.removeEventListener('mousemove', handleMouseMove, { capture: true });
  
  restoreTextSelection();
  isSelectionModeActive = false;
  
  // Remove selection prevention listeners
  const events = ['selectstart', 'mousedown', 'dragstart'];
  events.forEach(event => {
    document.removeEventListener(event, preventSelectionEvents, true);
  });

  if (selectionBox) {
    const rect = selectionBox.getBoundingClientRect();
    if (rect.width > 5 || rect.height > 5) {
      findAndProcessLinks(rect);
    }
    document.body.removeChild(selectionBox);
    selectionBox = null;
  }
}

// Process links in selection
function findAndProcessLinks(selectionRect) {
  const links = Array.from(document.querySelectorAll('a[href]'));
  
  const linksInSelection = links.filter(link => {
    const linkRect = link.getBoundingClientRect();
    return !(linkRect.right < selectionRect.left || 
             linkRect.left > selectionRect.right || 
             linkRect.bottom < selectionRect.top || 
             linkRect.top > selectionRect.bottom) && 
             link.offsetParent !== null;
  });

  // Sort links by position
  linksInSelection.sort((a, b) => {
    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();
    return rectA.top !== rectB.top ? rectA.top - rectB.top : rectA.left - rectB.left;
  });

  const validUrls = linksInSelection
    .map(link => link.href)
    .filter(url => url && url.startsWith('http'));

  const uniqueLinks = [...new Set(validUrls)];
  const limitedLinks = uniqueLinks.slice(0, userSettings.maxTabs);

  if (uniqueLinks.length > limitedLinks.length) {
    alert(`Found ${uniqueLinks.length} unique links.\nOpening the first ${userSettings.maxTabs} in order, as per your settings.`);
  }

  if (limitedLinks.length > 0) {
    chrome.runtime.sendMessage({ action: 'openLinks', urls: limitedLinks });
  }
}