// Default settings
const DEFAULT_SETTINGS = {
  maxTabs: 15,
  selectionStyle: 'style-default',
  rememberLinks: true
};

// Show status message
function showStatus(message) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.style.opacity = 1;
  setTimeout(() => { status.style.opacity = 0; }, 2000);
}

// Save options to chrome.storage
function saveOptions() {
  const maxTabs = parseInt(document.getElementById('max-tabs').value, 10);
  const selectionStyle = document.querySelector('input[name="selection-style"]:checked').value;
  const rememberLinks = document.getElementById('remember-links').checked;
  
  chrome.storage.sync.set({ maxTabs, selectionStyle, rememberLinks }, () => {
    showStatus('Settings saved.');
  });
}

// Load settings from chrome.storage and display them
function restoreOptions() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
    document.getElementById('max-tabs').value = items.maxTabs;
    document.getElementById(items.selectionStyle).checked = true;
    document.getElementById('remember-links').checked = items.rememberLinks;
  });
}

// Clear the recently opened links history
function clearHistory() {
  chrome.storage.local.set({ recentLinks: [] }, () => {
    showStatus('Link history cleared.');
  });
}

// Open Chrome shortcuts settings
function openShortcutSettings() {
  chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
}

// Event listeners
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('clear-history').addEventListener('click', clearHistory);
document.getElementById('shortcut-link').addEventListener('click', openShortcutSettings);