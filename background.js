const RECENT_LINKS_LIMIT = 20;

// Open options page on icon click
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

// Listen for the keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "activate_selection") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggleSelectionMode" });
      }
    });
  }
});

// Listen for links to open from content.js
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'openLinks' && request.urls) {
    let urlsToOpen = request.urls;

    // Get user settings first
    const settings = await chrome.storage.sync.get({ rememberLinks: true });

    // Check if option is enabled
    if (settings.rememberLinks) {
      const { recentLinks = [] } = await chrome.storage.local.get('recentLinks');
      const recentSet = new Set(recentLinks);
      
      const filteredUrls = request.urls.filter(url => !recentSet.has(url));

      if (filteredUrls.length === 0 && request.urls.length > 0) {
        console.log('Select and Open Links: All found links were already opened recently.');
        return;
      }

      urlsToOpen = filteredUrls;

      // Update history only if filtering was enabled
      const updatedRecentLinks = [...new Set([...urlsToOpen, ...recentLinks])].slice(0, RECENT_LINKS_LIMIT);
      await chrome.storage.local.set({ recentLinks: updatedRecentLinks });
    }

    // Open links if list is not empty
    if (urlsToOpen.length > 0) {
      urlsToOpen.forEach(url => {
        chrome.tabs.create({ url: url, active: false });
      });
    }
  }
});