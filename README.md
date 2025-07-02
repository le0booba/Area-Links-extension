# Area Links

> **Select. Open. Done.** A Chrome extension to select an area on a webpage and open or copy all links within it.
<br>

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome)
<br>

### Use Cases
- **Research:** Quickly open multiple academic papers or articles
- **Shopping:** Compare products across multiple tabs
- **Social Media:** Open interesting posts in bulk
- **Development:** Test multiple URLs from documentation
- **Content Curation:** Collect links for later reading

---

## ✨ Features

### 🎯 **Core Functionality**
- 🖱️ **Visual Area Selection:** Drag and drop to select multiple links at once
- 🚀 **Dual Mode Operation:** Open links in tabs/windows OR copy to clipboard
- ⚡ **Instant Action:** No menus, no clicks - just select and go

### 🎨 **Customization**
- **4 Selection Box Styles:** Classic Blue, Dashed Red, Dashed Green, Subtle Gray
- **Flexible Opening Options:** New tabs, new window, or reverse order
- **Smart Filtering:** Exclude specific domains and keywords
- **History Management:** Avoid duplicate links with intelligent tracking

### ⌨️ **Keyboard Shortcuts**
- **Default Open:** `Alt+Z`
- **Default Copy:** `Alt+X`
- *Fully customizable via Chrome shortcuts*
Customize shortcuts at `chrome://extensions/shortcuts`:

---

## 🚀 Quick Start

### Installation

1. **Download [LATEST RELEASE](https://github.com/le0booba/Area_Links/releases) from GitHub.**

2. **Load in Chrome:**
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode** (top right toggle)
   - Click **Load unpacked**
   - Select the `Area_Links` folder

3. **You're ready!** Look for the Area Links icon in your toolbar.

---

### Basic Usage

| Action | Steps |
|--------|-------|
| **Open Links** | Press `Alt+Z` → Drag box over links → Release |
| **Copy Links** | Press `Alt+X` → Drag box over links → Release |
| **Quick Settings** | Click extension icon → Adjust options |
| **Full Settings** | Click extension icon → Open Full Settings / Right-click icon → Options |

---

## ⚙️ Configuration

### ⚡ **Quick Settings** *(Popup)*
Access instant toggles by clicking the extension icon:
- Open in new window
- Open in reverse order  
- Remember opened links

### 🎛️ **Main Settings** *(Options Page)*

| Setting | Description |
|---------|-------------|
| **Excluded Domains** | Block specific sites (comma-separated) |
| **Excluded Words** | Skip links containing keywords |
| **Tab Limit** | Maximum tabs to open at once |
| **Selection Style** | Visual appearance of selection box |
| **Remember History** | Avoid reopening same links |
| **New Window Mode** | Open all links in new window |
| **Reverse Order** | Open links in reverse order |
| **Clear History** | Reset the stored history of opened links to clear duplicates and allow previously visited links to be reopened |
| **Open Full Settings** | Access the comprehensive settings page to configure all options, including excluded domains, tab limits, and selection styles |

---

## 🔧 Advanced Usage

### Filtering Examples
```
Excluded Domains: facebook.com, twitter.com, ads.google.com
Excluded Words: login, logout, unsubscribe, signup
```

---

## 🔒 Privacy & Permissions

<details>
<summary>Required Permissions</summary>

| Permission | Purpose |
|------------|---------|
| `storage` | Save your settings and link history |
| `tabs` | Open new tabs and manage windows |
| `scripting` | Inject selection interface into web pages |
| `<all_urls>` | Work on all websites you visit |

</details>

### Data Handling
- **🏠 Local Storage:** All settings stored locally via `chrome.storage.sync`
- **🚫 No Tracking:** Zero analytics, telemetry, or user data collection
- **🔒 No External Requests:** Extension operates entirely offline

*We only request permissions essential for core functionality.*

---

## 🛠️ Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| **Extension not working on page** | Area Links doesn't work on Chrome internal pages (`chrome://`, New Tab, etc.) |
| **Shortcuts not responding** | Check for conflicts in `chrome://extensions/shortcuts` |
| **No links opening** | Verify selection covers actual links, check tab limit settings |
| **Selection box invisible** | Try different style in options, check for conflicting extensions |
| **Links already visited** | History feature may be filtering duplicates - clear history or disable |

<details>
<summary>Debug Steps</summary>

1. **Check permissions:** Ensure extension has access to the current site
2. **Test selection:** Make sure you're dragging over actual `<a>` tags
3. **Review filters:** Temporarily disable domain/word exclusions
4. **Reset settings:** Use "Clear History" button in options

</details>

---

<div align="center">
<sup>⭐ Enjoy the extension? Give it a star!</sup>

**© badrenton 2025** | Made with 🖤 for productivity
</div>
