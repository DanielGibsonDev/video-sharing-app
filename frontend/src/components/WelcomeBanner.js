import React from 'react';
import tw from 'twrnc';
import { Pressable, View } from 'react-native';
import BoldText from './BoldText';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import MainText from './MainText';

export default function WelcomeBanner({ navigation, teamName }) {
  return (
    <Pressable
      onPress={() => navigation.navigate('CameraScreen')}
      hitSlop={0}
      style={({ pressed }) =>
        tw.style('flex-row w-full py-8 px-5 items-center justify-center', {
          opacity: pressed ? 0.5 : 1,
        })
      }
    >
      <View style={tw`absolute w-full h-full py-8 opacity-10 bg-white rounded-xl`} />
      <View style={tw`flex-row w-full px-5 items-center`}>
        <FontAwesome5 name="hand-sparkles" size={20} color="#34D399" />
        <View style={tw`pl-4`}>
          <BoldText style={tw`text-sm text-left pb-1`}>Welcome to team {teamName}!</BoldText>
          <MainText style={tw`text-xs`}>Get started by recording your first video.</MainText>
        </View>
        <Feather name="chevron-right" size={20} color="white" style={tw`pl-7`} />
      </View>
    </Pressable>
  );
}
