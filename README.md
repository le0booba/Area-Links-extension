# linkslinkslinks - Chrome extension

A Chrome extension that lets you select multiple links on a webpage and open them all at once with a keyboard shortcut.

## Features

- 🖱️ **Visual Selection**: Draw a box around links to open them all
- ⌨️ **Keyboard Shortcut**: Alt+Z (Windows/Linux) or Cmd+Shift+Y (Mac)
- 🎨 **Custom Styles**: Choose from 3 selection box appearances
- 📊 **Smart Filtering**: Prevents opening recently opened links
- ⚙️ **Configurable**: Set max tabs, customize appearance

## 📥 Installation

1. Download or clone this repository
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension folder

## 🚀 How to Use

1. Press `Alt+Z` (or `Cmd+Shift+Y` on Mac) to activate
2. Click and drag to select links
3. Release mouse - selected links open in new tabs

## ⚙️ Settings

Click the extension icon to configure:

- **Max Tabs**: How many tabs to open at once (default: 15)
- **Selection Style**: Blue Dashed, Green Glow, or Simple Red
- **Link History**: Prevent opening duplicate links
- **Keyboard Shortcut**: Customize via Chrome's shortcuts page

## 🔒 Privacy

- Only processes links on current webpage
- Stores settings locally in your browser
- No data collection or transmission
- Works offline

## 📁 File Structure

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

## 🛠️ Troubleshooting

- **Selection not working?** Refresh the page and try again
- **Links not opening?** Check your max tabs setting
- **Settings not saving?** Try disabling and re-enabling the extension

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  
**Built by [badrenton](https://github.com/badrenton) | Made with ❤️ for productivity enthusiasts**
<br>
*If you find this extension helpful, please consider giving it a ⭐ star on GitHub!*

</div>
