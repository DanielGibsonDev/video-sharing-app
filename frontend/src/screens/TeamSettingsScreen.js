import React, { useContext } from 'react';
import tw from 'twrnc';
import { StateContext } from '../utils/Context/StateContext';
import MainView from '../components/MainView';
import MainText from '../components/MainText';
import { Pressable, ScrollView, View } from 'react-native';
import { headerShadow } from '../utils/utils';
import SecondaryPressable from '../components/SecondaryPressable';
import BoldText from '../components/BoldText';
import SettingsItemRowUser from '../components/SettingsItemRowUser';
import { arrayRemove, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function UserSettingsScreen() {
  const [user, setUser, team, setTeam, videos, setVideos, teamUsers, setTeamUsers] =
    useContext(StateContext);

  const handleLeaveTeam = async () => {
    try {
      const teamRef = doc(db, 'teams', team.id);
      await updateDoc(teamRef, { user_ids: arrayRemove(user.id) });
      setTeam(null);
    } catch (error) {
      console.error('failed to remove user from team ', error);
    }
  };

  return (
    <>
      <View style={headerShadow} />
      <ScrollView indicatorStyle="black" style={tw`bg-black`}>
        <MainView style={tw`my-18`}>
          <View>
            <MainText style={tw`text-3xl`}>{team.name}</MainText>
            <MainText style={tw`text-xs pt-4 pb-6`}>
              {team.user_ids.length} team member{team.user_ids.length !== 1 && 's'} |{' '}
              {videos.length} video{videos.length !== 1 && 's'}
            </MainText>
          </View>

          <View style={tw`border-t border-white/10 w-full`} />

          <MainText style={tw`px-6 pt-10 pb-6`}>
            <MainText>
              Share this team code with your colleagues. They will be able to create an account and
              join your team,
            </MainText>
            <BoldText> {team.name}</BoldText>
          </MainText>

          <Pressable
            style={tw`flex-row items-center px-16 py-2.5 mb-10 bg-neutral-900 rounded-full`}
          >
            <MainText style={tw`text-[#BCE7FD] text-xl pr-3`}>{team.id}</MainText>
            {/*<FontAwesome name="share-square-o" size={24} color="#60A5FA" />*/}
          </Pressable>

          <View style={tw`w-full border-b border-white/10 pb-6 px-6 flex-row justify-between`}>
            <MainText>Team members</MainText>
            <MainText style={tw`text-xs opacity-60 self-center`}>{teamUsers.length}/10</MainText>
          </View>

          {teamUsers.map((teamUser) => (
            <SettingsItemRowUser key={teamUser.id} teamUser={teamUser} user={user} />
          ))}

          <SecondaryPressable style={tw`mt-12`} hitSlop={20} onPress={() => handleLeaveTeam()}>
            <MainText style={tw`text-red-400`}>Leave Team</MainText>
          </SecondaryPressable>
        </MainView>
      </ScrollView>
    </>
  );
}
