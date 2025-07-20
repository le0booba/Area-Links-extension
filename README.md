# Area Links

<div align="center">
  <div style="display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;">
    <img src="https://raw.githubusercontent.com/le0booba/Area_Links/refs/heads/main/screen-options-1.png" alt="Area Links Screenshot 1" width="300"/>
    <img src="https://raw.githubusercontent.com/le0booba/Area_Links/refs/heads/main/screen-options-2.png" alt="Area Links Screenshot 2" width="400"/>
  </div>
  
  **Select. Open. Done.**
  
  A powerful Chrome extension to select an area on any webpage and instantly open or copy all links within it.

  ![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome)
</div>

---

## 🚀 Quick Start

### Installation

1. **Download** the [LATEST RELEASE](https://github.com/le0booba/Area_Links/releases/latest) from GitHub
2. **Extract** the ZIP file to a folder on your computer
3. **Open Chrome** and navigate to `chrome://extensions/`
4. **Enable** "Developer mode" (toggle in top-right corner)
5. **Click** "Load unpacked" and select the extracted folder
6. **Done!** The Area Links icon will appear in your toolbar

### Basic Usage

| Action | Keyboard Shortcut | Steps |
|--------|------------------|-------|
| **Open Links** | `Alt+Z` (default) | Hold shortcut → Drag selection box → Release |
| **Copy Links** | `Alt+X` (default) | Hold shortcut → Drag selection box → Release |
| **Cancel Selection** | `Esc` | Press while in selection mode |

> **Tip:** Customize shortcuts at `chrome://extensions/shortcuts`

---

## 🌟 Features

### Core Functionality
- 🎯 **Visual Area Selection** - Intuitive drag-and-drop interface
- 🚀 **Dual Operation Modes** - Open links OR copy to clipboard
- ⚡ **Instant Action** - No menus, no clicks - just select and go
- 🔄 **Smart Duplicate Prevention** - Remembers previously opened links

### Customization Options
- 🎨 **4 Selection Box Styles** - Classic Blue, Dashed Red, Dashed Green, Subtle Gray
- 📂 **Flexible Opening** - New tabs, new window, or reverse order
- 🚫 **Smart Filtering** - Exclude specific domains and keywords
- ⚙️ **Configurable Limits** - Set maximum tabs to open at once
- 🎹 **Custom Shortcuts** - Fully customizable keyboard combinations

<details>
<summary>User Experience</summary>

- 📱 **Quick Settings Popup** - Fast access to common toggles
- 💾 **Settings Sync** - Preferences saved across browser instances
- 🎯 **Visual Link Highlighting** - Links within the selected area are visually highlighted in both open and copy modes, providing clear feedback on which links will be processed. When the "Remember opened links to avoid duplicates" or "Remove duplicates when copying links" option is enabled, duplicate links are not highlighted, ensuring users can easily identify unique links being targeted.

</details>

---

## 📋 Use Cases

Perfect for:
- **📚 Research** - Open multiple academic papers or articles
- **🛍️ Shopping** - Compare products across multiple tabs
- **📱 Social Media** - Open interesting posts in bulk
- **👨‍💻 Development** - Test multiple URLs from documentation
- **📖 Content Curation** - Collect links for later reading
- **📰 News Reading** - Open multiple articles from news aggregators

---

## ⚙️ Configuration

### Quick Settings (Extension Popup)
Click the extension icon for instant access to:
- 🔼 Open in new window
- 🔼 Open in reverse order  
- 🔼 Remember opened links to avoid duplicates
- 🔼 Remove duplicates when copying links

### Advanced Settings (Options Page)

<details>
<summary>View Advanced Settings</summary>

| Setting | Description | Example |
|---------|-------------|---------|
| **Excluded Domains** | Skip links from specific websites | `facebook.com, ads.google.com` |
| **Excluded Words** | Ignore links containing keywords | `login, logout, unsubscribe` |
| **Tab Limit** | Maximum tabs opened simultaneously | `1-50` (default: 15) |
| **Selection Style** | Visual appearance of selection box | 4 styles available |
| **History Management** | Remember opened links to prevent duplicates | ✅ Enabled by default |

</details>

---

## 🔒 Privacy & Security

**🔐 Security Guarantees**
- **🚫 Zero Tracking** - No analytics, telemetry, or user data collection
- **🔒 Offline Operation** - No external network requests or data transmission
- **🛡️ Local Processing** - All link detection and filtering happens on your device
- **🗑️ Easy Cleanup** - Clear history anytime via extension options

### Data Handling

<details>
<summary><strong>🏠 Local Storage (chrome.storage.local)</strong> - Data stored only on your device, never synced to your Google account</summary>

- **Link History** - URLs you've previously opened (up to 75 links)
- **History Preferences** - Whether to remember opened links (`useHistory`)
- **Copy Settings** - Remove duplicates when copying links (`checkDuplicatesOnCopy`)
</details>

<details>
<summary><strong>☁️ Chrome Sync Storage (chrome.storage.sync)</strong> - Settings synced to your Chrome account across devices</summary>

- **Excluded Domains** - Websites to skip (`excludedDomains`)
- **Excluded Words** - Keywords to filter out (`excludedWords`)
- **Tab Limits** - Maximum tabs to open (`tabLimit`)
- **Visual Settings** - Selection box style (`selectionStyle`)
- **Opening Behavior** - New window preference (`openInNewWindow`)
- **Order Settings** - Reverse link order (`reverseOrder`)
</details>

### Required Permissions

<details>
<summary>View Permission Details</summary>

| Permission | Purpose |
|------------|---------|
| `storage` | Save your preferences and link history locally |
| `tabs` | Create new tabs and manage browser windows |
| `scripting` | Inject the selection interface into web pages |
| `<all_urls>` | Enable functionality on all websites you visit |

*We only request permissions essential for core functionality.*

</details>

---

## 🛠️ Troubleshooting

### Common Issues

<details>
<summary>Extension not working on certain pages</summary>

**Problem:** Area Links doesn't respond on some pages.

**Solution:** The extension cannot work on Chrome's internal pages like:
- `chrome://` pages (settings, extensions, etc.)
- Chrome Web Store
- New Tab page
- Some restricted websites

**Workaround:** Navigate to a regular website and try again.
</details>

<details>
<summary>Keyboard shortcuts not responding</summary>

**Problem:** Alt+Z or Alt+X shortcuts don't work.

**Solutions:**
1. Check for shortcut conflicts at `chrome://extensions/shortcuts`
2. Ensure the extension is enabled
3. Try on a different website
4. Refresh the page and try again
</details>

<details>
<summary>No links opening despite selection</summary>

**Problem:** Selection works but no tabs open.

**Solutions:**
1. Verify your selection covers actual clickable links
2. Check if tab limit is reached (increase in settings)
3. Ensure popup blockers aren't interfering
4. Check if links are filtered by your exclusion rules
</details>

<details>
<summary>Links already visited message</summary>

**Problem:** Extension says "links already visited" but you want to open them again.

**Solutions:**
1. Click the extension icon → uncheck "Remember opened links"
2. Go to Options → click "Clear History"
3. Disable history feature temporarily
</details>

### Debug Steps
1. **Refresh the page** and try again
2. **Check extension permissions** for the current site
3. **Test on a simple webpage** with obvious links
4. **Temporarily disable other extensions** to check for conflicts
5. **Reset settings** using the options page

---

## 📁 Project Structure

```
Area_Links/
├── manifest.json           # Extension configuration
├── background.js          # Service worker & message handling  
├── content.js             # Page interaction & selection logic
├── styles.css             # Selection box styling
├── options.html           # Full settings page
├── options.js             # Settings page logic
├── popup.html             # Quick settings popup
├── popup.js               # Popup functionality
├── README.md              # Documentation
└── icons/                 # Extension icons
    ├── icon16.png
    ├── icon48.png
    ├── icon128.png
    └── peace.jpg
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <img src="icons/peace.jpg" width="50" alt="Peace" />
  
  **Made with ❤️ by badrenton**
  
  *© 2025 • Give it a ⭐ if you found it helpful!*
</div>
