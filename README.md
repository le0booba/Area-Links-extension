# Area Links

A Chrome extension that allows users to select a webpage area and open or copy all links within it efficiently.

---

## ✨ Features

- **Area Selection**: Drag a box over a webpage to select multiple links at once.
- **Open Links**: Open selected links in new tabs or a new window.
- **Copy Links**: Copy selected links to the clipboard for easy sharing.
- **Customizable Styles**: Choose from multiple selection box styles (Classic Blue, Dashed Red, Dashed Green, Subtle Gray).
- **Link Filtering**: Exclude domains or words and avoid duplicate links using history.
- **Configurable Settings**: Set tab limits, reverse link order, and more.
- **Keyboard Shortcuts**: Default shortcuts (Alt+Z for opening, Alt+X for copying) with customizable options.

<p align="center">
  <img src="https://raw.githubusercontent.com/le0booba/Area_Links/refs/heads/main/demo.gif" alt="Area Links Demo" width="40%">
</p>

---

## 🛠️ Installation

1. **Download the Extension**:
   - Clone the repository: `git clone https://github.com/le0booba/Area_Links.git`
   - Or download the ZIP file from the [GitHub releases page](https://github.com/le0booba/Area_Links/releases).

2. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** (toggle in the top-right corner).
   - Click **Load unpacked** and select the folder containing the extension files.
   - The extension will appear in your Chrome toolbar.

3. **Verify**:
   - Click the extension icon or go to the options page to confirm it’s installed.

---

## 📖 How to Use

1. **Open Links**:
   - Press `Alt+Z` (default shortcut) to activate selection mode.
   - Drag a box over the desired links using the left mouse button.
   - Release to open all valid links in new tabs or a new window (based on settings).

2. **Copy Links**:
   - Press `Alt+X` (default shortcut) to activate copy mode.
   - Drag a box over the links.
   - Release to copy the links to your clipboard.

3. **Access Options**:
   - Right-click the extension icon and select **Options** to configure settings.
   - Customize shortcuts via `chrome://extensions/shortcuts`.

---

## ⚙️ Configuration & Options

<details>
<summary>Click to view available options</summary>

<p align="center">
  <img src="https://raw.githubusercontent.com/le0booba/Area_Links/refs/heads/main/screen_options.png" width="500" style="margin-right: 10px;">
  <img src="https://raw.githubusercontent.com/le0booba/Area_Links/refs/heads/main/screen_hotkeys.png" width="700" style="margin-right: 10px;">
</p>

- **Excluded Domains**: Enter comma-separated domains (e.g., `example.com, test.org`) to skip links from those sites.
- **Excluded Words**: Enter comma-separated words to exclude links containing them (e.g., `login, signup`).
- **Maximum Tabs**: Set a limit for the number of tabs opened at once (default: 15).
- **Selection Box Style**: Choose from Classic Blue, Dashed Red, Dashed Green, or Subtle Gray.
- **Remember History**: Enable to avoid opening duplicate links (stored locally).
- **Open in New Window**: Open links in a new browser window instead of tabs.
- **Reverse Order**: Open links in reverse order of selection.
- **Clear History**: Reset the link history via the options page.
- **Shortcuts**: Customize via `chrome://extensions/shortcuts`.

</details>

---

## 🔒 Privacy

- **Data Storage**: All settings and link history are stored locally using Chrome’s `storage.sync` API.
- **No Tracking**: The extension does not collect or transmit any user data.
- **Permissions**:
  - `storage`: For saving user settings and link history.
  - `tabs`: To open new tabs or windows.
  - `scripting`: To inject content scripts for link selection.
  - `host_permissions: <all_urls>`: To function on any webpage (filtered by user settings).

---

## 🛠️ Troubleshooting

<details>
<summary>Click to view common issues and solutions</summary>

- **Extension doesn’t work on some pages**:
  - The extension cannot run on Chrome internal pages (e.g., `chrome://`) or the New Tab page due to browser restrictions.
  - Ensure the page is fully loaded before using the shortcut.

- **Shortcuts not working**:
  - Check for conflicts in `chrome://extensions/shortcuts`.
  - Reassign shortcuts if needed.

- **Links not opening/copying**:
  - Verify that the selection box covers the links completely.
  - Check if the links are excluded by domain or word filters in the options.
  - Ensure the tab limit isn’t reached.

- **Selection box not visible**:
  - Try switching to a different selection style in the options.
  - Ensure no other extensions are interfering with CSS.

</details>

---

## 📂 File Structure

```
Area_Links/
├── background.js        # Service worker for handling link opening and history
├── content.js           # Content script for area selection and link processing
├── manifest.json        # Extension configuration
├── options.html         # Options page UI
├── options.js           # Options page logic
├── popup.html           # Popup UI
├── popup.js             # Popup logic
├── styles.css           # Selection box styles
├── icons/               # Extension icons (16px, 48px, 128px)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md            # Project documentation
└── LICENSE.md            # The MIT software license.
```

---

<p align="center">
`` © 2025 badrenton ``
<sup>⭐ Enjoying the extension? Consider giving it a star!</sup>
</p>
