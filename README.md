# VTmusics

VTmusics is a music discovery and playback app for the web and Android, built with Expo and React Native. One codebase supports both platforms.

## Requirements

- Node.js 20 LTS (recommended for this Expo SDK)
- npm
- For Android: Expo Go on a physical Android phone, or an Android emulator

## Run locally

Clone the repository and enter its folder:

```bash
git clone https://github.com/ratheeshsubramani364-cpu/VTmusics.git
cd VTmusics
npm install
```

Start the web app:

```bash
npx expo start --web
```

Or start Expo and choose a platform from the terminal:

```bash
npx expo start
```

For Android, scan the QR code using Expo Go on your phone. The computer and phone should be on the same Wi-Fi network. If LAN connection is blocked, try:

```bash
npx expo start --tunnel
```

To open directly in an Android emulator, start the emulator first, then run:

```bash
npm run android
```

If dependencies or Metro's cache are causing problems, from the project directory run:

```bash
npx expo install --fix
npx expo start --clear
```

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
