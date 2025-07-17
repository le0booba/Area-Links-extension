const QUICK_SETTINGS_CONFIG = [
  { id: 'popup-openInNewWindow', key: 'openInNewWindow', default: false },
  { id: 'popup-reverseOrder', key: 'reverseOrder', default: false },
  { id: 'popup-useHistory', key: 'useHistory', default: true },
  { id: 'popup-checkDuplicatesOnCopy', key: 'checkDuplicatesOnCopy', default: true },
];

function showStatus() {
  const statusEl = document.getElementById('status263'); 
  statusEl.textContent = 'Saved!';
  setTimeout(() => { 
    statusEl.textContent = ''; 
  }, 1200);
}

document.addEventListener('DOMContentLoaded', () => {
  const keysToGet = QUICK_SETTINGS_CONFIG.map(c => c.key);
  chrome.storage.sync.get(keysToGet, (items) => {
    QUICK_SETTINGS_CONFIG.forEach(config => {
      const el = document.getElementById(config.id);
      if (el) {
        el.checked = items[config.key] !== undefined ? items[config.key] : config.default;
      }
    });
  });

  QUICK_SETTINGS_CONFIG.forEach(config => {
    const el = document.getElementById(config.id);
    if (el) {
      el.addEventListener('change', (e) => {
        chrome.storage.sync.set({ [config.key]: e.target.checked }).then(showStatus);
      });
    }
  });

  document.getElementById('open-options').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
    window.close(); 
  });
});