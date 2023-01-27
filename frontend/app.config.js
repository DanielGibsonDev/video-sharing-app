import 'dotenv/config';

export default {
  expo: {
    name: 'Video Sharing App',
    slug: 'video-sharing-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/app-icon.png',
    scheme: 'com.danielgibsondev.video-sharing-app',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/pals-splashscreen.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: 'https://u.expo.dev/5d720ff5-32c9-44c2-bbd7-a541cce87ed6',
    },
    originalFullName: '@danielgibsondev/video-sharing-app',
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.danielgibsondev.video-sharing-app',
      infoPlist: {
        NSCameraUsageDescription: 'Allow Video Sharing App to use the camera to record videos and upload them.',
        NSMicrophoneUsageDescription:
          'Allow Video Sharing App to access your microphone while recording videos.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/app-icon.png',
        backgroundColor: '#FFFFFF',
      },
      package: 'com.danielgibsondev.video-sharing-app',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      eas: {
        projectId: '0cdb9463-0eee-4cf9-8e16-14a8bee9078e',
      },
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        googleClientId: process.env.GOOGLE_CLIENT_ID,
      },
    },
    owner: 'danielgibsondev',
    // plugins: ['@react-native-backend/app', '@react-native-backend/auth'],
    runtimeVersion: {
      policy: 'sdkVersion',
    },
  },
};
