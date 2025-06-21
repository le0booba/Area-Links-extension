# Select and Open Links

A Chrome extension that allows you to select multiple links on a webpage and open them all at once with a simple keyboard shortcut and mouse selection.

## Features

- 🖱️ **Visual Selection**: Draw a selection box around links to open them all at once
- ⌨️ **Keyboard Shortcut**: Quick activation with customizable hotkey (default: Alt+Z on Windows/Linux, Cmd+Shift+Y on Mac)
- 🎨 **Customizable Appearance**: Choose from multiple selection box styles
- 📊 **Smart Link Management**: Prevents opening duplicate links that were recently opened
- ⚙️ **Configurable Settings**: Set maximum number of tabs to open, customize appearance, and manage link history
- 🔄 **Intelligent Sorting**: Links are opened in reading order (top to bottom, left to right)

## Installation

### From Chrome Web Store
*Coming soon - extension is currently in development*

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your toolbar

## How to Use

### Usage
1. **Activate Selection Mode**: Press `Alt+Z` (Windows/Linux) or `Cmd+Shift+Y` (Mac)
2. **Select Links**: Click and drag to draw a selection box around the links you want to open
3. **Open Links**: Release the mouse button - all selected links will open in new tabs

## Settings

Access settings by clicking the extension icon in your toolbar. Available options include:

### General Settings
- **Maximum Tabs**: Set the maximum number of tabs to open at once (1-100, default: 15)
- **Selection Style**: Choose from three visual styles for the selection box:
  - Blue Dashed (default)
  - Green Glow
  - Simple Red

### Link History
- **Prevent Duplicate Links**: Avoid opening links that were recently opened
- **History Management**: Clear the history of recently opened links
- The extension remembers the last 20 opened links

### Keyboard Shortcuts
- Customize the activation shortcut through Chrome's extension shortcuts page
- Default shortcuts:
  - Windows/Linux: `Alt+Z`
  - Mac: `Cmd+Shift+Y`

## Technical Details

### Permissions
The extension requires the following permissions:
- `tabs`: To open new tabs with selected links
- `storage`: To save user preferences and link history
- `activeTab`: To interact with the current webpage

### Browser Compatibility
- Chrome 88+ (Manifest V3 compatible)
- Chromium-based browsers (Edge, Brave, etc.)

### File Structure
```
├── manifest.json          # Extension manifest
├── background.js          # Service worker for tab management
├── content.js            # Content script for link selection
├── options.html          # Settings page
├── options.js            # Settings page logic
├── style.css             # Selection box styles
├── icon16.png            # Extension icon (16x16)
├── icon48.png            # Extension icon (48x48)
├── icon128.png           # Extension icon (128x128)
└── README.md             # This file
```

## Privacy

This extension:
- ✅ Only processes links on the current webpage
- ✅ Stores settings locally in your browser
- ✅ Does not collect or transmit any personal data
- ✅ Does not require internet connection to function
- ✅ Only accesses websites when you explicitly select and open links

## Troubleshooting

### Selection Mode Not Working
- Make sure the extension is enabled in `chrome://extensions/`
- Try refreshing the webpage
- Check if the keyboard shortcut conflicts with other extensions

### Links Not Opening
- Verify that the selected area contains valid links
- Check if you've reached the maximum tab limit in your settings
- Some websites may block automatic link opening due to security policies

### Settings Not Saving
- Ensure you have sufficient storage space
- Try disabling and re-enabling the extension
- Clear browser cache if issues persist

### License
This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  
**🛠️ Built by [badrenton](https://github.com/badrenton) | ⚡ Made with ❤️ for productivity enthusiasts**
<br>
*If you find this extension helpful, please consider giving it a ⭐ star on GitHub!*

</div>
