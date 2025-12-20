# iOS status bar configuration

To remove the warning about `UIViewControllerBasedStatusBarAppearance` and allow React Native / Expo to control the status bar style, set the Info.plist flag through Expo config (do not edit Info.plist directly):

```json
// app.json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "UIViewControllerBasedStatusBarAppearance": true
      }
    }
  }
}
```

This makes iOS use the view-controller-based status bar API so calls to `StatusBar` or `expo-status-bar` take effect without the runtime warning.

## Applying the change
1. Update the config as above.
2. Restart Expo and clear the cache (for example `npx expo start -c`).
3. Rebuild or reload your iOS app so the native Info.plist is regenerated.

## Expo Go vs. custom dev client
- **Custom dev client / EAS build:** The Info.plist is regenerated from `app.json` or `app.config.js`, so the warning disappears and status bar appearance can be controlled from JS.
- **Expo Go:** The bundled host app’s Info.plist cannot be changed, so the warning may still appear. It is safe to ignore in Expo Go; it will be resolved in a custom build.
