function restorePopupOptions() {
  chrome.storage.sync.get(
    {
      openInNewWindow: false,
      reverseOrder: false,
      useHistory: true,
      checkDuplicatesOnCopy: true
    },
    items => {
      document.getElementById('popup-openInNewWindow').checked = items.openInNewWindow;
      document.getElementById('popup-reverseOrder').checked = items.reverseOrder;
      document.getElementById('popup-useHistory').checked = items.useHistory;
      document.getElementById('popup-checkDuplicatesOnCopy').checked = items.checkDuplicatesOnCopy;
    }
  );
}

function savePopupOption(key, value) {
  chrome.storage.sync.set({ [key]: value }, () => {
    const status = document.getElementById('status263');
    status.textContent = 'Saved!';
    
    setTimeout(() => { 
      status.textContent = ''; 
    }, 900);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  restorePopupOptions();
  
  [
    ['popup-openInNewWindow', 'openInNewWindow'],
    ['popup-reverseOrder', 'reverseOrder'],
    ['popup-useHistory', 'useHistory'],
    ['popup-checkDuplicatesOnCopy', 'checkDuplicatesOnCopy']
  ].forEach(([id, key]) => {
    document.getElementById(id).addEventListener('change', e => {
      savePopupOption(key, e.target.checked);
    });
  });
  
  document.getElementById('open-options').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});