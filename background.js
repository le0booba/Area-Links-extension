const HISTORY_LIMIT = 15;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    excludedDomains: '',
    tabLimit: 15,
    linkHistory: [],
    useHistory: true,
    selectionStyle: 'classic-blue'
  });
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (
    (command === "activate-selection" || command === "activate-selection-copy") &&
    tab.url &&
    (tab.url.startsWith('http://') || tab.url.startsWith('https://'))
  ) {
    const { selectionStyle } = await chrome.storage.sync.get('selectionStyle');
    chrome.tabs.sendMessage(
      tab.id,
      {
        type: command === "activate-selection" ? "initiateSelection" : "initiateSelectionCopy",
        style: selectionStyle || 'classic-blue'
      },
      () => {
        if (chrome.runtime.lastError) {
          console.warn(
            "Could not establish connection. Is the page reloading?",
            chrome.runtime.lastError.message
          );
        }
      }
    );
  } else if (
    command === "activate-selection" ||
    command === "activate-selection-copy"
  ) {
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

  const excludedDomains = settings.excludedDomains
    ? settings.excludedDomains.split(',').map(d => d.trim().toLowerCase()).filter(Boolean)
    : [];
  const excludedWords = settings.excludedWords
    ? settings.excludedWords.split(',').map(w => w.trim().toLowerCase()).filter(Boolean)
    : [];
  const tabLimit = settings.tabLimit || 15;
  const linkHistory = settings.linkHistory || [];
  const useHistory = settings.useHistory !== false;
  const openInNewWindow = !!settings.openInNewWindow;
  const reverseOrder = !!settings.reverseOrder;

  let uniqueUrls = Array.from(new Set(urls));

  if (reverseOrder) {
    uniqueUrls.reverse();
  }

  const filteredUrls = uniqueUrls.filter(url => {
    if (useHistory && linkHistory.includes(url)) {
      return false;
    }
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      if (excludedDomains.some(domain => hostname.includes(domain))) {
        return false;
      }
      if (excludedWords.some(word => word && url.toLowerCase().includes(word))) {
        return false;
      }
    } catch {
      return false;
    }
    return true;
  });

  const urlsToOpen = filteredUrls.slice(0, tabLimit);

  if (openInNewWindow && urlsToOpen.length > 0) {
    chrome.windows.create({ url: urlsToOpen, focused: true });
  } else {
    urlsToOpen.forEach(url => {
      chrome.tabs.create({ url, active: false });
    });
  }

  if (useHistory && urlsToOpen.length > 0) {
    const newHistory = [...urlsToOpen, ...linkHistory].slice(0, HISTORY_LIMIT);
    chrome.storage.sync.set({ linkHistory: newHistory });
  }
}