// --- Весь существующий код options.js остается без изменений ---

// Saves options to chrome.storage
function saveOptions() {
  const maxTabs = document.getElementById('max-tabs').value;
  const selectionStyle = document.querySelector('input[name="selection-style"]:checked').value;
  const rememberLinks = document.getElementById('remember-links').checked;
  
  chrome.storage.sync.set({
    maxTabs: parseInt(maxTabs, 10),
    selectionStyle: selectionStyle,
    rememberLinks: rememberLinks
  }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Settings saved.';
    status.style.opacity = 1;
    setTimeout(() => {
      status.style.opacity = 0;
    }, 2000);
  });
}

// Loads settings from chrome.storage and displays them
function restoreOptions() {
  chrome.storage.sync.get({
    maxTabs: 15,
    selectionStyle: 'style-default',
    rememberLinks: true
  }, (items) => {
    document.getElementById('max-tabs').value = items.maxTabs;
    document.getElementById(items.selectionStyle).checked = true;
    document.getElementById('remember-links').checked = items.rememberLinks;
  });
}

// Clears the recently opened links history
function clearHistory() {
    chrome.storage.local.set({ recentLinks: [] }, () => {
        const status = document.getElementById('status');
        status.textContent = 'Link history cleared.';
        status.style.opacity = 1;
        setTimeout(() => {
          status.style.opacity = 0;
        }, 2000);
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('clear-history').addEventListener('click', clearHistory);

// --- НОВЫЙ КОД ДЛЯ ИСПРАВЛЕНИЯ ССЫЛКИ ---
document.getElementById('shortcut-link').addEventListener('click', () => {
  // Используем API для открытия страницы настроек горячих клавиш
  chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
});