import React, { useContext } from 'react';
import { Pressable } from 'react-native';
import tw from 'twrnc';
import MainSafeAreaView from '../../components/MainSafeAreaView';
import MainView from '../../components/MainView';
import MainText from '../../components/MainText';
import MainPressable from '../../components/MainPressable';
import { StateContext } from '../../utils/Context/StateContext';
import { Ionicons } from '@expo/vector-icons';
import SecondaryText from '../../components/SecondaryText';
import BoldText from '../../components/BoldText';

export default function SuccessJoinOrCreateScreen({ navigation, route }) {
  const [user, setUser, team, setTeam, videos, setVideos] = useContext(StateContext);
  const { teamData, hasJoinedTeam = false } = route.params;

  const continueToHome = () => {
    setTeam({
      ...teamData,
      user_ids: teamData.user_ids ? [...teamData.user_ids, user.id] : [user.id],
    });
  };

  if (hasJoinedTeam) {
    return (
      <MainSafeAreaView>
        <MainView style={tw`mt-10`}>
          <Ionicons name="checkmark-circle-sharp" size={25} color="#34D399" />

          <MainText style={tw`text-3xl px-10 pt-7`}>
            You have joined the team <BoldText style={tw`text-3xl`}>{teamData.name}</BoldText>
          </MainText>

          <MainPressable hitSlop={20} onPress={() => continueToHome()}>
            <SecondaryText>Continue to home</SecondaryText>
          </MainPressable>
        </MainView>
      </MainSafeAreaView>
    );
  }

  return (
    <MainSafeAreaView>
      <MainView style={tw`mt-10`}>
        <Ionicons name="checkmark-circle-sharp" size={25} color="#34D399" />

        <MainText style={tw`text-3xl px-10 pt-7`}>
          You have created the team <BoldText style={tw`text-3xl`}>{teamData.name}</BoldText>
        </MainText>
        <MainText style={tw`py-6 px-10`}>
          Share this team code with your colleagues. They will be able to create an account and join
          your team, <BoldText>{teamData.name}</BoldText>
        </MainText>

        <Pressable
          style={tw`flex-row items-center w-4/5 justify-center py-2.5 bg-neutral-900 rounded-full`}
        >
          <MainText style={tw`text-[#BCE7FD] text-xl pr-3`}>{teamData.id}</MainText>
          {/*<FontAwesome name="share-square-o" size={24} color="#60A5FA" />*/}
        </Pressable>

        <MainPressable hitSlop={20} onPress={() => continueToHome()}>
          <SecondaryText>Continue to home</SecondaryText>
        </MainPressable>
      </MainView>
    </MainSafeAreaView>
  );
}
