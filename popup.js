const QUICK_SETTINGS_CONFIG = [
  { id: 'popup-openInNewWindow', key: 'openInNewWindow', default: false, storage: 'sync' },
  { id: 'popup-reverseOrder', key: 'reverseOrder', default: false, storage: 'sync' },
  { id: 'popup-useHistory', key: 'useHistory', default: true, storage: 'local' },
  { id: 'popup-checkDuplicatesOnCopy', key: 'checkDuplicatesOnCopy', default: true, storage: 'local' },
];

function showStatus() {
  const statusEl = document.getElementById('status-message');
  statusEl.textContent = 'Saved!';
  setTimeout(() => {
    statusEl.textContent = '';
  }, 1200);
}

document.addEventListener('DOMContentLoaded', async () => {
  const syncKeys = QUICK_SETTINGS_CONFIG.filter(c => c.storage === 'sync').map(c => c.key);
  const localKeys = QUICK_SETTINGS_CONFIG.filter(c => c.storage === 'local').map(c => c.key);

  const [syncItems, localItems] = await Promise.all([
    syncKeys.length > 0 ? chrome.storage.sync.get(syncKeys) : Promise.resolve({}),
    localKeys.length > 0 ? chrome.storage.local.get(localKeys) : Promise.resolve({})
  ]);
  const items = { ...syncItems, ...localItems };

  QUICK_SETTINGS_CONFIG.forEach(config => {
    const el = document.getElementById(config.id);
    if (el) {
      el.checked = items[config.key] !== undefined ? items[config.key] : config.default;
      el.addEventListener('change', (e) => {
        const storageArea = config.storage === 'local' ? chrome.storage.local : chrome.storage.sync;
        storageArea.set({ [config.key]: e.target.checked }).then(showStatus);
      });
    }
  });

  document.getElementById('open-options').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
    window.close();
  });
});