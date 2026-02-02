# VolantaPatcher

A utility to patch the [Volanta](https://volantaapp.com/) desktop client. This tool injects a custom loader script into the application to modify the UI, remove unwanted elements, and clean up the interface.

## Download

Download the latest executable from the [Releases](https://github.com/StarNumber12046/VolantaPatcher/releases) page.

## Features

The patcher injects `lib/loader.js`, which currently applies the following modifications:

*   **Minimal Sidebar:** Removes sidebar links for Schedules, Events, Activities, Teams, and the Orbs balance.
*   **Minimal Right Panel:** Cleans up specific elements in the map filter container.
*   **Remove Browser:** Hides the in-app browser panel button.
*   **Remove Premium Spam:** Hides "Customize profile" ads and party cards.
*   **Remove Mapbox Logo:** Hides the Mapbox attribution and logo.
*   **UI Tweaks:** Makes the bottom navigation container transparent.
*   **Patch Info:** Adds a small credit to the Settings > Info page indicating the app is patched.

## Prerequisites

*   [Bun](https://bun.com) (v1.0+)
*   Volanta Desktop App installed (Windows)

## Installation & Usage

1.  Clone this repository:
    ```bash
    git clone https://github.com/StarNumber12046/VolantaPatcher.git
    cd VolantaPatcher
    ```

2.  Install dependencies:
    ```bash
    bun install
    ```

3.  Run the patcher:
    ```bash
    bun run index.ts
    ```

The script will:
1.  Locate your Volanta installation (assumes `%LOCALAPPDATA%/Programs/Volanta`).
2.  Extract the `app.asar` archive.
3.  Inject the loader script into `index.html`.
4.  Rebuild and overwrite `app.asar`.

**Note:** The tool attempts to back up the original files in some versions, but it is recommended to keep a copy of your `resources/app.asar` before running patches.

## Development

*   `index.ts`: Main entry point. Handles ASAR extraction, file manipulation, and repacking.
*   `lib/patcher.ts`: Core patching logic.
*   `lib/loader.js`: The client-side script injected into the Volanta renderer process. Add your own DOM manipulation logic here to create new patches.

## Disclaimer

This tool is for educational purposes only. Modifying the client may violate Volanta's Terms of Service. Use at your own risk.
