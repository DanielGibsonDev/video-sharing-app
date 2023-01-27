import 'intl';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { useFonts } from '@expo-google-fonts/inter';
import { StateContext } from './src/utils/Context/StateContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { fonts } from './src/utils/utils';
import Route from './src/navigation/main';
import { useFetchUser } from './src/utils/hooks/useFetchUser';
import { useFetchTeam } from './src/utils/hooks/useFetchTeam';
import 'intl/locale-data/jsonp/en';
import * as SplashScreen from 'expo-splash-screen';
import tw from 'twrnc';

if (Platform.OS === 'android') {
  // See https://github.com/expo/expo/issues/6536 for this issue.
  if (typeof Intl.__disableRegExpRestore === 'function') {
    Intl.__disableRegExpRestore();
  }
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  /*
  Context:
    user: {id, name, ... } context matches database
    team: {id, name, video_ids, user_ids}
    videos: {id, created_by, upload_id, upload_status, created_at, duration, playback_id, mux_id, team_id }[]
   */
  const [user, setUser] = useState();
  const [team, setTeam] = useState();
  const [videos, setVideos] = useState([]);
  const [teamUsers, setTeamUsers] = useState([]);

  const [isAppReady, setIsAppReady] = useState(false);

  const [fontsLoaded] = useFonts(fonts);

  // Fetch user from local storage if available
  const [isLoadingUser] = useFetchUser({ setUser });

  // Fetch team from database
  const [isLoadingTeam] = useFetchTeam({
    user,
    setTeam,
    isLoadingUser,
  });

  useEffect(() => {
    if (!isLoadingUser && !isLoadingTeam) {
      setIsAppReady(true);
    }
  }, [isLoadingUser, isLoadingTeam]);

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!fontsLoaded || !isAppReady) {
    return null;
  }

  return (
    <View style={tw`flex-1`} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <StateContext.Provider
          value={[user, setUser, team, setTeam, videos, setVideos, teamUsers, setTeamUsers]}
        >
          <Route />
        </StateContext.Provider>
      </SafeAreaProvider>
    </View>
  );
}
