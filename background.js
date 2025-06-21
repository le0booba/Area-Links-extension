chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openLinks' && request.urls) {
    // Открываем каждую ссылку в новой неактивной вкладке
    request.urls.forEach(url => {
      chrome.tabs.create({ 
        url: url,
        active: false // Новая вкладка не станет активной
      });
    });
  }
});