import React, { useContext } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import tw from 'twrnc';
import { StateContext } from '../utils/Context/StateContext';
import MainView from '../components/MainView';
import SettingsItemRow from '../components/SettingsItemRow';
import MainText from '../components/MainText';
import MainPressable from '../components/MainPressable';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { headerShadow } from '../utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserSettingsScreen() {
  const [user, setUser, team, setTeam, videos, setVideos, teamUsers, setTeamUsers] =
    useContext(StateContext);

  const handleLogout = () => {
    AsyncStorage.removeItem('userData').catch((error) =>
      console.error('Async storage removal error', error),
    );
    setUser(null);
    setTeam(null);
    setVideos([]);
    setTeamUsers([]);
  };

  return (
    <>
      <View style={headerShadow} />
      <ScrollView indicatorStyle="black" style={tw`bg-black`}>
        <MainView style={tw`my-18`}>
          {user.picture ? (
            <Image source={{ uri: user.picture }} style={tw`w-20 h-20 rounded-full`} />
          ) : (
            <FontAwesome name="user-circle" size={80} color="white" />
          )}

          <MainText style={tw`text-3xl pt-7`}>{user.name}</MainText>
          <MainText style={tw`text-base pt-4 pb-7`}>{team.name}</MainText>
          <View style={tw`border-t border-white/10 w-full`} />
          <SettingsItemRow title="Name" content={user.name} />
          <SettingsItemRow title="Email" content={user.email} />
          <SettingsItemRow title="Team name" content={team.name} />

          <MainPressable style={tw`mt-16`} onPress={() => handleLogout()}>
            <MainText style={tw`text-black text-base`}>Log out</MainText>
          </MainPressable>
          {/*<SecondaryPressable style={tw`m-0`}>*/}
          {/*  <MainText style={tw`text-red-400`}>Delete Account</MainText>*/}
          {/*</SecondaryPressable>*/}
          {/*<SecondaryPressable style={tw`mt-4`}>*/}
          {/*  <MainText style={tw`text-red-400`}>Delete Team</MainText>*/}
          {/*</SecondaryPressable>*/}
          <View style={tw`my-10 px-6 w-full`}>
            <Pressable>
              <MainText>Terms and conditions (TBD)</MainText>
            </Pressable>
            <Pressable>
              <MainText>Privacy policy (TBD)</MainText>
            </Pressable>
          </View>
          <MainText>© 2023 Pals - All Rights Reserved</MainText>
        </MainView>
      </ScrollView>
    </>
  );
}
