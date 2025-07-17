const HISTORY_LIMIT = 15;
const DEFAULT_SETTINGS = {
  excludedDomains: '',
  excludedWords: '',
  tabLimit: 15,
  linkHistory: [],
  useHistory: true,
  selectionStyle: 'classic-blue',
  checkDuplicatesOnCopy: true,
  openInNewWindow: false,
  reverseOrder: false
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(DEFAULT_SETTINGS);
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if ((command === "activate-selection" || command === "activate-selection-copy") && tab.url?.startsWith('http')) {
    const { selectionStyle } = await chrome.storage.sync.get({
      selectionStyle: DEFAULT_SETTINGS.selectionStyle
    });
    
    chrome.tabs.sendMessage(tab.id, {
      type: command === "activate-selection" ? "initiateSelection" : "initiateSelectionCopy",
      style: selectionStyle
    }).catch(error => {
      console.warn(`Area Links: Could not establish connection with content script. ${error.message}`);
    });
  } else if (command === "activate-selection" || command === "activate-selection-copy") {
    console.log("Area Links: Cannot activate on non-http pages (e.g., chrome://, New Tab Page).");
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "openLinks":
      processLinks(request.urls);
      return false;
    
    case "clearHistory":
      chrome.storage.sync.set({ linkHistory: [] })
        .then(() => sendResponse({ success: true, message: 'History cleared!' }))
        .catch(err => sendResponse({ success: false, message: err.message }));
      return true;
  }
  return false;
});

async function processLinks(urls) {
  const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  
  const excludedDomains = settings.excludedDomains.split(',').map(d => d.trim().toLowerCase()).filter(Boolean);
  const excludedWords = settings.excludedWords.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);

  let uniqueUrls = [...new Set(urls)];
  if (settings.reverseOrder) uniqueUrls.reverse();

  const filteredUrls = uniqueUrls.filter(url => {
    if (settings.useHistory && settings.linkHistory.includes(url)) return false;
    
    try {
      const urlHostname = new URL(url).hostname.toLowerCase();
      if (excludedDomains.some(domain => urlHostname.includes(domain))) return false;
      if (excludedWords.some(word => url.toLowerCase().includes(word))) return false;
    } catch {
      return false;
    }
    
    return true;
  });

  const urlsToOpen = filteredUrls.slice(0, settings.tabLimit);
  
  if (urlsToOpen.length === 0) return;

  if (settings.openInNewWindow) {
    chrome.windows.create({ url: urlsToOpen, focused: true });
  } else {
    urlsToOpen.forEach(url => chrome.tabs.create({ url, active: false }));
  }

  if (settings.useHistory) {
    const newHistory = [...urlsToOpen, ...settings.linkHistory].slice(0, HISTORY_LIMIT);
    chrome.storage.sync.set({ linkHistory: newHistory });
  }
}