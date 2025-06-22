# Area Link Opener

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-v100%2B-blue?logo=google-chrome&logoColor=white" alt="Chrome Version">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" alt="Maintained">
  <img src="https://img.shields.io/badge/version-1.4-orange" alt="Version 1.4">
</p>

A powerful Chrome extension to select a part of a webpage and open all links within that area in new tabs, with advanced filtering and customization.

<p align="center">
  <em>(Replace this with a GIF of the extension in action)</em><br>
  <img src="https://user-images.githubusercontent.com/10940564/203953782-274e3663-10e3-4c4f-9a1b-3b361a91d575.gif" alt="Area Link Opener Demo" width="80%">
</p>

## 🧰 Features

*   **🖱️ Area Selection:** Press `Alt + Z`, then click and drag to select any rectangular area on a webpage.
*   **🚦 Smart Filtering:** Automatically ignores javascript links, internal page anchors (`#`), and user-defined domains.
*   **🔢 Tab Limiting:** Set a maximum number of tabs to open at once to prevent browser overload.
*   **📚 Smart History:** Remembers the last 15 opened links to avoid opening duplicates (can be toggled on/off).
*   **🎨 Customizable Highlighting:** Choose from multiple visual styles for the selection box to suit your preference.
*   **⌨️ Shortcut Ready:** The activation shortcut can be easily customized via Chrome's native extensions page.

## 🚀 Installation

<details>
<summary><strong>Click for instructions on loading as an unpacked extension</strong></summary>

1.  **Download:** Download this repository as a ZIP file from GitHub by clicking the `Code` button and then `Download ZIP`.
2.  **Unzip:** Extract the ZIP file to a permanent location on your computer.
3.  **Open Chrome Extensions:** Open Google Chrome and navigate to `chrome://extensions`.
4.  **Enable Developer Mode:** In the top right corner of the Extensions page, turn on the "Developer mode" toggle.
5.  **Load Unpacked:** The "Load unpacked" button will appear. Click it.
6.  **Select Folder:** In the file dialog, navigate to the folder where you unzipped the files and select it.
7.  The "Area Link Opener" extension will now appear in your list of extensions and is ready to use.

</details>

## 🖱️ How to Use

1.  Press **`Alt + Z`** on any webpage. Your cursor will change to a crosshair `+`.
2.  **Click and drag** your mouse to draw a box around the links you want to open.
3.  **Release** the mouse button. The extension will filter the links and open the valid ones in new, inactive tabs.

## 🔒 Privacy

Your privacy is a top priority. This extension is designed to be secure and private by default.

*   **Local Processing:** All processing of links and page content happens entirely on your computer.
*   **No Data Transmission:** The extension **does not** send any data—including your browsing history, selected links, or settings—to any external server.
*   **Local Storage:** All settings and your recent link history are stored locally on your machine using the standard `chrome.storage.sync` API, which syncs only across your own logged-in Chrome instances.

## ⚙️ Configuration & Options

To access the settings, click the extension's icon in your Chrome toolbar.

<details>
<summary><strong>Click to see available configuration options</strong></summary>

<br>

<p align="center">
  <em>(Replace this with a screenshot of your options page)</em><br>
  <img src="https://i.imgur.com/your-options-page-screenshot.png" alt="Options Page Screenshot" width="80%">
</p>

*   **Excluded Domains:** A comma-separated list of domains to ignore.
*   **Maximum Tabs:** Limit the number of tabs opened in a single operation.
*   **Selection Box Style:** Choose the visual theme of the selection box.
*   **Remember Opened Links:** Toggle the feature that prevents re-opening links from your recent history.
*   **Clear History:** Immediately clear the memory of recently opened links.

</details>

## 🔧 Troubleshooting

If you encounter an issue, please check the common solutions below.

*   **Problem:** The `Alt + Z` shortcut doesn't work.
    *   **Solution 1:** The shortcut will not work on special Chrome pages (like `chrome://extensions`, the New Tab Page) or the Chrome Web Store. This is a security feature of Chrome. Try it on a regular website.
    *   **Solution 2:** Another extension might be using the same shortcut. You can change the shortcut for Area Link Opener by navigating to `chrome://extensions/shortcuts`.

*   **Problem:** Some links in my selection are not opening.
    *   **Solution 1:** Check your settings. The link might be from an excluded domain, a duplicate from your recent history (if enabled), or you may have hit the "Maximum Tabs" limit.
    *   **Solution 2:** The extension intentionally ignores `javascript:` links and internal page anchors (e.g., `#section-2`) as they don't lead to new pages.

## 📁 File Structure

```
link-opener-extension/
├── manifest.json         # Core file defining the extension's properties and permissions.
├── background.js         # Service worker for handling core logic, events, and storage.
├── content.js            # Injects into webpages to handle DOM interaction (area selection).
├── options.html          # The HTML structure for the settings page.
├── options.js            # The JavaScript logic for the settings page.
├── styles.css            # Defines the visual styles for the selection box.
├── icons/                # Contains all the extension's icons (16, 48, 128px).
├── README.md             # You are here.
└── LICENSE.md            # The MIT software license.
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.
