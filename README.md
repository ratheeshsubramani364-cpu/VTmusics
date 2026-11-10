# VTmusics

VTmusics is a music discovery and playback app for web and Android, built with Expo and React Native. One codebase supports both platforms.

## Included in this starter

- Responsive home screen with curated playlists and song discovery
- Search by song title, artist, or album
- Like songs and browse your liked songs in the Library
- Audio playback controls for the included demo tracks
- Dark theme with a compact mobile layout
- Expo EAS profiles for Android preview APK and production app bundle builds

## Run locally

Install Node.js, clone the repository, and install dependencies:

```bash
npm install
```

Start the web app:

```bash
npm run web
```

Start the Android development app (requires an Android device/emulator):

```bash
npm run android
```

You can also run `npm start` and scan the Expo QR code with Expo Go.

## Build

Export a static web build to `dist/`:

```bash
npm run build:web
```

Create an installable Android preview APK:

```bash
npx eas-cli build --platform android --profile preview
```

Create a production Android app bundle:

```bash
npx eas-cli build --platform android --profile production
```

EAS builds require an Expo account and project configuration. For publishing, follow Expo's EAS setup and store submission instructions.

## Demo content and limitations

The included audio and artwork are remote demo assets, so an internet connection is required. Replace them with properly licensed music and artwork before publishing. This starter does not yet include user accounts, cloud syncing, backend services, or a licensed music catalog. It is not affiliated with YouTube Music.
