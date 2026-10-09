---
name: Expo Media Library platform split
description: Prevent SDK 57 Expo Media Library's native module from breaking the web preview.
---

Keep Expo Media Library and Expo File System imports inside a native-only adapter, with a web adapter for unsupported photo-library operations. Guarding native calls with `Platform.OS` is not enough if the package is imported at the top level: the web bundle can resolve a native-only module and throw before the guard runs.

**Why:** The Clearspace web preview failed during module evaluation because `ExpoMediaLibraryNext` is unavailable on web, even though photo access was only intended for iOS and Android.

**How to apply:** For apps that preview on web, route photo-library operations through platform-resolved `.native` and `.web` modules; keep their shared types in a separate platform-neutral file.
