# Area Links

A Chrome extension to select an area on a webpage and open or copy all links within it.

---

## ✨ Features

- **Area Selection**: Drag a box to select multiple links.
- **Open or Copy Links**: Open links in new tabs/windows or copy them to clipboard.
- **Customizable Selection Box**: Choose from several styles.
- **Link Filtering**: Exclude domains/words, avoid duplicates via history.
- **Configurable Settings**: Tab limits, reverse order, and more.
- **Keyboard Shortcuts**: Default: Alt+Z (open), Alt+X (copy). Customizable.

---

## 🛠️ Installation

1. **Get the Extension**:
   - Clone: `git clone https://github.com/le0booba/Area_Links.git`
   - Or download ZIP from [GitHub releases](https://github.com/le0booba/Area_Links/releases).

2. **Load in Chrome**:
   - Go to `chrome://extensions/`, enable **Developer mode**.
   - Click **Load unpacked** and select the extension folder.

3. **Verify**:
   - Click the extension icon or open the options page.

---

## 📖 Usage

- **Open Links**: Press `Alt+Z`, drag a box over links, release to open them.
- **Copy Links**: Press `Alt+X`, drag a box, release to copy links to clipboard.
- **Options**: Right-click the icon → Options, or go to the options page.
- **Shortcuts**: Customize via `chrome://extensions/shortcuts`.

---

## ⚙️ Options

- **Excluded Domains**: Comma-separated (e.g. `example.com, test.org`).
- **Excluded Words**: Comma-separated (e.g. `login, signup`).
- **Maximum Tabs**: Limit tabs opened at once (default: 15).
- **Selection Box Style**: Choose from 4 styles.
- **Remember History**: Avoid opening duplicate links.
- **Open in New Window**: Open links in a new window.
- **Reverse Order**: Open links in reverse order.
- **Clear History**: Reset link history.
- **Shortcuts**: Change via `chrome://extensions/shortcuts`.

---

## 🔒 Privacy & Permissions

- **Data**: All settings/history stored locally via Chrome `storage.sync`.
- **No Tracking**: No user data is collected or transmitted.
- **Permissions**:
  - `storage`, `tabs`, `scripting`, `host_permissions: <all_urls>`

---

## 🛠️ Troubleshooting

- **Doesn't work on some pages**: Not available on Chrome internal pages or New Tab.
- **Shortcuts not working**: Check for conflicts and reassign in `chrome://extensions/shortcuts`.
- **Links not opening/copying**: Ensure selection covers links, check filters and tab limits.
- **Selection box not visible**: Try a different style or check for conflicting extensions.

---

## 📂 File Structure

```
Area-Links-extension/
├── background.js        # Service worker for link handling/history
├── content.js           # Content script for area selection
├── manifest.json        # Extension config
├── options.html         # Options UI
├── options.js           # Options logic
├── popup.html           # Popup UI
├── popup.js             # Popup logic
├── styles.css           # Selection box styles
├── icons/               # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # Documentation
```

---

<p align="center">
© 2025 badrenton<br>
<sup>⭐ Enjoying the extension? Give it a star!</sup>
</p>
