const HISTORY_LIMIT = 50;
const SYNC_DEFAULTS = {
  excludedDomains: '',
  excludedWords: '',
  tabLimit: 15,
  selectionStyle: 'classic-blue',
  openInNewWindow: false,
  reverseOrder: false
};
const LOCAL_DEFAULTS = {
  linkHistory: [],
  useHistory: true,
  checkDuplicatesOnCopy: true,
};

async function getSettings() {
  const [syncSettings, localSettings] = await Promise.all([
    chrome.storage.sync.get(SYNC_DEFAULTS),
    chrome.storage.local.get(LOCAL_DEFAULTS)
  ]);
  return { ...syncSettings, ...localSettings };
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(SYNC_DEFAULTS);
  chrome.storage.local.set(LOCAL_DEFAULTS);
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  const isActivationCommand = command === "activate-selection" || command === "activate-selection-copy";
  if (!isActivationCommand || !tab.url?.startsWith('http')) {
    if (isActivationCommand) {
      console.log("Area Links: Cannot activate on this page (e.g., chrome://, New Tab Page).");
    }
    return;
  }

  const settings = await getSettings();

  chrome.tabs.sendMessage(tab.id, {
    type: command === "activate-selection" ? "initiateSelection" : "initiateSelectionCopy",
    style: settings.selectionStyle,
    checkDuplicatesOnCopy: settings.checkDuplicatesOnCopy,
    useHistory: settings.useHistory,
    linkHistory: settings.useHistory ? settings.linkHistory : []
  }).catch(error => {
    console.warn(`Area Links: Could not establish connection with content script. ${error.message}`);
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "openLinks") {
    processLinks(request.urls);
    return false;
  }
  if (request.type === "clearHistory") {
    chrome.storage.local.set({ linkHistory: [] })
      .then(() => sendResponse({ success: true, message: 'History cleared!' }))
      .catch(err => sendResponse({ success: false, message: err.message }));
    return true;
  }
  return false;
});

async function processLinks(urls) {
  const settings = await getSettings();

  const excludedDomains = settings.excludedDomains.split(',').map(d => d.trim().toLowerCase()).filter(Boolean);
  const excludedWords = settings.excludedWords.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);

  let uniqueUrls = [...new Set(urls)];
  if (settings.reverseOrder) {
    uniqueUrls.reverse();
  }

  const filteredUrls = uniqueUrls.filter(url => {
    if (settings.useHistory && settings.linkHistory.includes(url)) {
      return false;
    }
    try {
      const lowerCaseUrl = url.toLowerCase();
      const urlHostname = new URL(url).hostname.toLowerCase();
      if (excludedDomains.some(domain => urlHostname.includes(domain))) return false;
      if (excludedWords.some(word => lowerCaseUrl.includes(word))) return false;
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
    chrome.storage.local.set({ linkHistory: newHistory });
  }
}