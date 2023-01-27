import React, { useContext } from 'react';
import tw from 'twrnc';
import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import MediumText from './MediumText';
import { StateContext } from '../utils/Context/StateContext';

export default function SecondaryHeader({ navigation, title, isTeamScreen = false }) {
  const [user, setUser, team, setTeam, videos, setVideos] = useContext(StateContext);

  return (
    <View style={tw`mt-13 px-8`}>
      <Pressable
        style={tw`absolute left-0 pl-8 z-10`}
        hitSlop={20}
        onPress={() => navigation.dispatch(CommonActions.goBack())}
      >
        <Feather name="arrow-left" size={24} color="white" />
      </Pressable>
      <MediumText style={tw`text-white`}>{title}</MediumText>
    </View>
  );
}
