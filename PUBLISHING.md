# Shared model gearing on GitHub Pages

The RPM calculator lists only verified models. Manage Models lists only unverified models, including personal saved gearing, and can be filtered by brand. Once verified gearing is published and the app reloads, the model disappears from Manage Models and appears in the calculator. Personal gearing and backups remain local to each browser; saving or importing them does not make a model available in the calculator.

## Publish a verified model

1. Open Manage Models and choose **Set gearing** for the model.
2. Enter the installed main/equivalent teeth and pinion teeth. Check the values against the appropriate manual and drivetrain revision.
3. Put the verification source in **Notes / source**. Optionally enter a source URL in the owner section.
4. Select **Prepare catalogue update**. This downloads a proposed `verified-gearing.json` containing the current published catalogue plus your change.
5. Review the downloaded file. In your GitHub repository, replace `verified-gearing.json` on the branch configured as the GitHub Pages publishing source and commit the change. Publish only after you have checked the source.
6. After GitHub Pages finishes deploying, online users receive the catalogue when they reopen/reload the app. Previously cached offline copies remain available until the device reconnects.

Preparing or importing a personal backup does not establish verification. Only the catalogue deployed from the repository does. Publishing access is controlled by GitHub repository permissions: keep repository write access limited to the owner if only the owner should verify.

Verified gearing takes priority over personal saved values for the same brand/model. Source-check status applies to a specific drivetrain revision; the calculator still reminds users to confirm their installed gearing.

## Initial deployment

Publish these application files together: `index.html`, `gearing.html`, `model-catalog.js`, `verified-gearing.json`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, and `icon-512.png`. Keep relative paths unchanged. The new catalogue initially contains the seven existing source-checked presets; this change does not independently re-verify their manufacturer specifications.

The service worker refreshes the shared JSON from the network and caches it for offline use. The app validates catalogue entries before applying them and falls back to bundled source-checked presets if the catalogue is unavailable or invalid. Preparing a publication requires successfully loading the current catalogue, to reduce the risk of overwriting newer entries.

If multiple updates are being prepared, reload before each update and compare the downloaded file against the current repository before committing. GitHub commit review is the final publishing step.

## Tests

With Node.js installed, run:

```sh
node tests/catalog.test.mjs
```

The tests exercise the actual app scripts with a simulated DOM, browser storage, downloads, and service-worker cache APIs. They cover calculator calculations, catalogue loading and precedence, filters, preparation of owner updates, malformed data, and offline caching. They do not replace a real-browser layout or installation check.
