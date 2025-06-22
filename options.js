function showStatus(message, duration = 2000) {
  const status = document.getElementById('status');
  status.textContent = message;
  setTimeout(() => {
    status.textContent = '';
  }, duration);
}

function saveOptions() {
  const excludedDomains = document.getElementById('excludedDomains').value;
  const excludedWords = document.getElementById('excludedWords').value;
  const tabLimit = document.getElementById('tabLimit').value;
  const useHistory = document.getElementById('useHistory').checked;
  const selectionStyle = document.getElementById('selectionStyle').value;
  const openInNewWindow = document.getElementById('openInNewWindow').checked;
  const reverseOrder = document.getElementById('reverseOrder').checked;

  chrome.storage.sync.set({
    excludedDomains: excludedDomains,
    excludedWords: excludedWords,
    tabLimit: parseInt(tabLimit, 10),
    useHistory: useHistory,
    selectionStyle: selectionStyle,
    openInNewWindow: openInNewWindow,
    reverseOrder: reverseOrder
  }, () => {
    showStatus('Options saved.');
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    excludedDomains: '',
    excludedWords: '',
    tabLimit: 15,
    useHistory: true,
    selectionStyle: 'classic-blue',
    openInNewWindow: false,
    reverseOrder: false
  }, (items) => {
    document.getElementById('excludedDomains').value = items.excludedDomains;
    document.getElementById('excludedWords').value = items.excludedWords;
    document.getElementById('tabLimit').value = items.tabLimit;
    document.getElementById('useHistory').checked = items.useHistory;
    document.getElementById('selectionStyle').value = items.selectionStyle;
    document.getElementById('openInNewWindow').checked = items.openInNewWindow;
    document.getElementById('reverseOrder').checked = items.reverseOrder;
  });
}

function clearHistory() {
  chrome.runtime.sendMessage({ type: "clearHistory" }, (response) => {
    if (response.success) {
      showStatus(response.message);
    } else {
      showStatus('Error clearing history.', 3000);
    }
  });
}

function openShortcuts() {
  chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('clearHistory').addEventListener('click', clearHistory);
document.getElementById('shortcutsLink').addEventListener('click', openShortcuts);

document.addEventListener('DOMContentLoaded', function() {
  const version = chrome.runtime.getManifest().version;
  const versionElem = document.getElementById('ext-version');
  if (versionElem) {
    versionElem.textContent = 'v' + version;
  }
});