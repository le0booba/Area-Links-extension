const DEFAULT_SETTINGS = {
  excludedDomains: '',
  excludedWords: '',
  tabLimit: 15,
  useHistory: true,
  checkDuplicatesOnCopy: true,
  selectionStyle: 'classic-blue',
  openInNewWindow: false,
  reverseOrder: false
};

function showStatus(message, duration = 2500) {
  const status = document.getElementById('status');
  status.textContent = message;
  setTimeout(() => {
    status.textContent = '';
  }, duration);
}

function saveOptions() {
  const settingsToSave = {
    excludedDomains: document.getElementById('excludedDomains').value.trim(),
    excludedWords: document.getElementById('excludedWords').value.trim(),
    tabLimit: parseInt(document.getElementById('tabLimit').value, 10) || DEFAULT_SETTINGS.tabLimit,
    useHistory: document.getElementById('useHistory').checked,
    checkDuplicatesOnCopy: document.getElementById('checkDuplicatesOnCopy').checked,
    selectionStyle: document.getElementById('selectionStyle').value,
    openInNewWindow: document.getElementById('openInNewWindow').checked,
    reverseOrder: document.getElementById('reverseOrder').checked,
  };
  
  chrome.storage.sync.set(settingsToSave, () => showStatus('Options saved.'));
}

function restoreOptions() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, items => {
    document.getElementById('excludedDomains').value = items.excludedDomains;
    document.getElementById('excludedWords').value = items.excludedWords;
    document.getElementById('tabLimit').value = items.tabLimit;
    document.getElementById('useHistory').checked = items.useHistory;
    document.getElementById('checkDuplicatesOnCopy').checked = items.checkDuplicatesOnCopy;
    document.getElementById('selectionStyle').value = items.selectionStyle;
    document.getElementById('openInNewWindow').checked = items.openInNewWindow;
    document.getElementById('reverseOrder').checked = items.reverseOrder;
    updateClearButtonsState();
  });
}

function clearHistory() {
  chrome.runtime.sendMessage({ type: "clearHistory" }, response => {
    showStatus(response?.success ? response.message : 'Error clearing history.', 3000);
  });
}

function updateClearButtonsState() {
  document.getElementById('clearExcludedDomains').disabled = document.getElementById('excludedDomains').value.trim() === '';
  document.getElementById('clearExcludedWords').disabled = document.getElementById('excludedWords').value.trim() === '';
}

document.addEventListener('DOMContentLoaded', () => {
  restoreOptions();
  
  document.getElementById('save').addEventListener('click', saveOptions);
  document.getElementById('clearHistory').addEventListener('click', clearHistory);
  document.getElementById('shortcutsLink').addEventListener('click', () => {
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  });

  const domainsTextarea = document.getElementById('excludedDomains');
  const wordsTextarea = document.getElementById('excludedWords');
  
  domainsTextarea.addEventListener('input', updateClearButtonsState);
  wordsTextarea.addEventListener('input', updateClearButtonsState);
  
  document.getElementById('clearExcludedDomains').addEventListener('click', () => {
    domainsTextarea.value = '';
    updateClearButtonsState();
  });
  
  document.getElementById('clearExcludedWords').addEventListener('click', () => {
    wordsTextarea.value = '';
    updateClearButtonsState();
  });
  
  const versionElem = document.getElementById('ext-version');
  if (versionElem) {
      versionElem.textContent = 'v' + chrome.runtime.getManifest().version;
  }
});