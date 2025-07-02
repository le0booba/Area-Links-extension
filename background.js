const HISTORY_LIMIT = 15;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    excludedDomains: '',
    tabLimit: 15,
    linkHistory: [],
    useHistory: true,
    selectionStyle: 'classic-blue',
    checkDuplicatesOnCopy: true
  });
});

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());

chrome.commands.onCommand.addListener(async (command, tab) => {
  if ((command === "activate-selection" || command === "activate-selection-copy") && tab.url?.startsWith('http')) {
    const { selectionStyle = 'classic-blue' } = await chrome.storage.sync.get('selectionStyle');
    
    chrome.tabs.sendMessage(
      tab.id,
      {
        type: command === "activate-selection" ? "initiateSelection" : "initiateSelectionCopy",
        style: selectionStyle
      },
      () => {
        if (chrome.runtime.lastError) {
          console.warn("Could not establish connection. Is the page reloading?", chrome.runtime.lastError.message);
        }
      }
    );
  } else if (command === "activate-selection" || command === "activate-selection-copy") {
    console.log("Area Links: Cannot activate on this page (e.g., chrome:// or New Tab Page).");
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "openLinks") {
    processLinks(request.urls);
    return true;
  }
  
  if (request.type === "clearHistory") {
    chrome.storage.sync.set({ linkHistory: [] }, () => {
      sendResponse({ success: true, message: 'History cleared!' });
    });
    return true;
  }
});

async function processLinks(urls) {
  const settings = await chrome.storage.sync.get([
    'excludedDomains',
    'excludedWords',
    'tabLimit',
    'linkHistory',
    'useHistory',
    'openInNewWindow',
    'reverseOrder'
  ]);
  
  const {
    excludedDomains = '',
    excludedWords = '',
    tabLimit = 15,
    linkHistory = [],
    useHistory = true,
    openInNewWindow = false,
    reverseOrder = false
  } = settings;
  
  const domains = excludedDomains.split(',').map(d => d.trim().toLowerCase()).filter(Boolean);
  const words = excludedWords.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
  
  let uniqueUrls = Array.from(new Set(urls));
  if (reverseOrder) uniqueUrls.reverse();
  
  const filteredUrls = uniqueUrls.filter(url => {
    if (useHistory && linkHistory.includes(url)) return false;
    
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      if (domains.some(domain => hostname.includes(domain))) return false;
      if (words.some(word => word && url.toLowerCase().includes(word))) return false;
    } catch {
      return false;
    }
    
    return true;
  });
  
  const urlsToOpen = filteredUrls.slice(0, tabLimit);
  
  if (openInNewWindow && urlsToOpen.length) {
    chrome.windows.create({ url: urlsToOpen, focused: true });
  } else {
    urlsToOpen.forEach(url => chrome.tabs.create({ url, active: false }));
  }
  
  if (useHistory && urlsToOpen.length) {
    chrome.storage.sync.set({ 
      linkHistory: [...urlsToOpen, ...linkHistory].slice(0, HISTORY_LIMIT) 
    });
  }
}