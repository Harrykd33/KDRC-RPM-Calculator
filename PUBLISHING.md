# Shared model gearing on GitHub Pages

The RPM calculator lists only verified models. Manage Models lists only unverified models, including personal saved gearing, and can be filtered by brand. Once verified gearing is published and the app reloads, the model disappears from Manage Models and appears in the calculator. Personal gearing and backups remain local to each browser; saving or importing them does not make a model available in the calculator.

Owner verification and publishing tools require PIN **2904** each time the page opens or reloads. Personal offline model tools are available without a PIN. Use **Lock Manage Models** to lock it again. This client-side PIN is a convenience gate; GitHub repository permissions still control publishing.

A **✓** beside a model means its gearing has been saved on this device. The check mark remains after reloading and disappears if the saved gearing is deleted. It does not mean the model is verified.

On the RPM calculator, select **Custom gearing** to disable brand/model selection and enter your own gear values (use 1 and 1 for direct drive). Clear the checkbox to restore the selected verified model. Custom values are not saved or verified.

## Publish a verified model

1. Open Manage Models and choose **Set gearing** for the model.
2. Enter the installed main/equivalent teeth and pinion teeth, or select **Direct drive (1:1)** for a motor connected directly to the main rotor. Direct drive disables the tooth fields and saves a fixed 1:1 ratio. Check the values against the appropriate manual and drivetrain revision.
3. Put the verification source in **Notes / source**. Optionally enter a source URL in the owner section.
4. Select **Prepare catalogue update**. This downloads a proposed `verified-gearing.json` containing the current published catalogue plus your change.
5. Review the downloaded file. In your GitHub repository, replace `verified-gearing.json` on the branch configured as the GitHub Pages publishing source and commit the change. Publish only after you have checked the source.
6. After GitHub Pages finishes deploying, online users receive the catalogue when they reopen/reload the app. Previously cached offline copies remain available until the device reconnects.

Preparing or importing a personal backup does not establish verification. Only the catalogue deployed from the repository does. Publishing access is controlled by GitHub repository permissions: keep repository write access limited to the owner if only the owner should verify.

Verified gearing takes priority over personal saved values for the same brand/model. Source-check status applies to a specific drivetrain revision; the calculator still reminds users to confirm their installed gearing.

## Initial deployment

Publish these application files together: `index.html`, `gearing.html`, `model-catalog.js`, `tutorial.js`, `verified-gearing.json`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, and `icon-512.png`. Keep relative paths unchanged. The new catalogue initially contains the seven existing source-checked presets; this change does not independently re-verify their manufacturer specifications.

The service worker refreshes the shared JSON from the network and caches it for offline use. The app validates catalogue entries before applying them and falls back to bundled source-checked presets if the catalogue is unavailable or invalid. Preparing a publication requires successfully loading the current catalogue, to reduce the risk of overwriting newer entries.

If multiple updates are being prepared, reload before each update and compare the downloaded file against the current repository before committing. GitHub commit review is the final publishing step.

## Personal offline custom gearing

In Manage Models, use **My offline custom models** above the PIN to enter gearing (or Direct drive) and save. Owner tools also retain the **Save as my offline custom model** option. These entries stay in that browser’s local storage and do not require a verification source. Select **Use custom gearing**, or enable Custom gearing in the calculator and choose an entry from **My offline custom models**. Regular brand/model selectors still list only verified models. Personal entries can use different gearing for an already verified model without changing the published preset.

The **My offline custom models** section is available before the PIN. Users can add, edit, delete, export, import, and use their own offline models without unlocking. Verification and publishing remain behind the owner PIN. Offline models belong to a browser/device, not a signed-in account; shared browser profiles share saved entries. Export/import backups to transfer entries or protect them from cleared browser data. Load the app online once before offline use.

## Battery range and estimation guidance

Battery cells support **2S–16S**, with **8S** as the default. The tutorial explains standard-LiPo nominal voltage (3.7 V), full-charge voltage (4.2 V), and choosing representative voltage under load. The existing 3.85 V default is an adjustable estimate, not a nominal specification. See the [Horizon Hobby battery manual](https://www.horizonhobby.com/on/demandware.static/Sites-horizon-us-Site/Sites-horizon-master/default/Manuals/HRC44167_Manual.pdf).

It also explains 80% as a governor-headroom starting point, rather than a universal efficiency optimum. The [Hobbywing Platinum 120A V5 manual](https://www.hobbywing.com/en/uploads/file/20240527/2273240252a029433b4ecff9a249c567.pdf) gives a 70–90% range for its Store Governor mode and explains compensation limits. Specific ESC modes and setups differ.

## First-start tutorial

The calculator starts a guided tutorial on the first visit in each browser. Arrows and highlights explain the main controls; Back, Next, Skip, Escape, and Finish control the tour. Dismissing or finishing remembers the choice locally. The **Tutorial** button below the calculator actions replays it at any time. The tour is cached for offline use and does not change calculator settings.

## Mobile layout

The calculator adapts spacing and text to screen width and usable viewport height, includes safe-area padding for phone notches, and uses a tighter layout on short screens. Form inputs retain 16px text to avoid focus zoom on phones. Small screens, landscape orientation, enlarged system text, or long source notes may still require scrolling so content remains accessible.

## Tests

With Node.js installed, run:

```sh
node tests/catalog.test.mjs
```

The tests exercise the actual app scripts with a simulated DOM, browser storage, downloads, and service-worker cache APIs. They cover calculator calculations, catalogue loading and precedence, filters, preparation of owner updates, malformed data, and offline caching. They do not replace a real-browser layout or installation check.
