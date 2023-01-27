import React, { useContext } from 'react';
import tw from 'twrnc';
import { Pressable, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import MediumText from './MediumText';
import { StateContext } from '../utils/Context/StateContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function MainHeader({ navigation, title = undefined }) {
  const [user, setUser, team, setTeam, videos, setVideos] = useContext(StateContext);

  return (
    <View style={tw`mt-10 pt-3 px-8 flex-row justify-between items-center`}>
      <Pressable hitSlop={20} onPress={() => navigation.navigate('UserSettingsScreen')}>
        <FontAwesome name="cog" size={25} color="#BCE7FD" />
      </Pressable>

      <View>
        <MediumText style={tw`text-2xl text-white`}>{title ? title : team.name}</MediumText>
      </View>

      <Pressable hitSlop={20} onPress={() => navigation.navigate('TeamSettingsScreen')}>
        <FontAwesome5 name="users" size={24} color="#BCE7FD" />
      </Pressable>
    </View>
  );
}
