const SYNC_SETTINGS_KEYS = ['excludedDomains', 'excludedWords', 'tabLimit', 'selectionStyle', 'openInNewWindow', 'reverseOrder'];
const LOCAL_SETTINGS_KEYS = ['useHistory', 'checkDuplicatesOnCopy'];

const DEFAULT_SETTINGS = {
  excludedDomains: '',
  excludedWords: '',
  tabLimit: 15,
  selectionStyle: 'classic-blue',
  openInNewWindow: false,
  reverseOrder: false,
  useHistory: true,
  checkDuplicatesOnCopy: true,
};

function showStatus(message, duration = 2500, isError = false) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.style.color = isError ? '#dc3545' : '#105a9b';
  setTimeout(() => {
    status.textContent = '';
  }, duration);
}

function updateClearButtonsState() {
  document.getElementById('clearExcludedDomains').disabled = document.getElementById('excludedDomains').value.trim() === '';
  document.getElementById('clearExcludedWords').disabled = document.getElementById('excludedWords').value.trim() === '';
}

function saveOptions() {
  const tabLimitInput = document.getElementById('tabLimit');
  const tabLimitValue = parseInt(tabLimitInput.value, 10);

  if (isNaN(tabLimitValue) || tabLimitValue < 1 || tabLimitValue > 50) {
    showStatus('Error: Tab limit must be between 1 and 50.', 3500, true);
    return;
  }

  const settingsToSave = {
    excludedDomains: document.getElementById('excludedDomains').value.trim(),
    excludedWords: document.getElementById('excludedWords').value.trim(),
    tabLimit: tabLimitValue,
    selectionStyle: document.getElementById('selectionStyle').value,
    openInNewWindow: document.getElementById('openInNewWindow').checked,
    reverseOrder: document.getElementById('reverseOrder').checked,
    useHistory: document.getElementById('useHistory').checked,
    checkDuplicatesOnCopy: document.getElementById('checkDuplicatesOnCopy').checked,
  };

  const syncSettings = {};
  SYNC_SETTINGS_KEYS.forEach(key => (syncSettings[key] = settingsToSave[key]));

  const localSettings = {};
  LOCAL_SETTINGS_KEYS.forEach(key => (localSettings[key] = settingsToSave[key]));

  Promise.all([
    chrome.storage.sync.set(syncSettings),
    chrome.storage.local.set(localSettings)
  ]).then(() => {
    showStatus('Options saved.');
  });
}

async function restoreOptions() {
  const syncDefaults = SYNC_SETTINGS_KEYS.reduce((acc, key) => ({ ...acc, [key]: DEFAULT_SETTINGS[key] }), {});
  const localDefaults = LOCAL_SETTINGS_KEYS.reduce((acc, key) => ({ ...acc, [key]: DEFAULT_SETTINGS[key] }), {});

  const [syncItems, localItems] = await Promise.all([
    chrome.storage.sync.get(syncDefaults),
    chrome.storage.local.get(localDefaults)
  ]);

  const items = { ...syncItems, ...localItems };

  document.getElementById('excludedDomains').value = items.excludedDomains;
  document.getElementById('excludedWords').value = items.excludedWords;
  document.getElementById('tabLimit').value = items.tabLimit;
  document.getElementById('selectionStyle').value = items.selectionStyle;
  document.getElementById('openInNewWindow').checked = items.openInNewWindow;
  document.getElementById('reverseOrder').checked = items.reverseOrder;
  document.getElementById('useHistory').checked = items.useHistory;
  document.getElementById('checkDuplicatesOnCopy').checked = items.checkDuplicatesOnCopy;

  updateClearButtonsState();
}

function clearHistory() {
  chrome.runtime.sendMessage({ type: "clearHistory" }, response => {
    if (chrome.runtime.lastError) {
      showStatus('Error clearing history.', 3000, true);
    } else {
      showStatus(response?.message || 'History cleared.', 3000, !response?.success);
    }
  });
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

  document.getElementById('ext-version').textContent = 'v' + chrome.runtime.getManifest().version;
  document.getElementById('copyright-year').textContent = new Date().getFullYear();
});