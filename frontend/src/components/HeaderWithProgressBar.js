import React from 'react';
import tw from 'twrnc';
import { Pressable, SafeAreaView, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import MediumText from './MediumText';

export default function HeaderWithProgressBar({
  navigation,
  progressStep,
  title,
  isBackAvailable,
}) {
  return (
    <SafeAreaView style={tw`bg-black`}>
      <View style={tw``}>
        <View style={tw`px-6 flex-row`}>
          <View style={tw`h-0.5 w-[5.125rem] border-t-2 border-white`} />
          <View style={tw`h-0.5 w-0.5`} />
          <View
            style={tw.style(
              'h-0.5 w-[5.125rem] border-t-2 border-white',
              progressStep < 2 && 'opacity-30',
            )}
          />
          <View style={tw`h-0.5 w-0.5`} />
          <View
            style={tw.style(
              'h-0.5 w-[5.125rem] border-t-2 border-white',
              progressStep < 3 && 'opacity-30',
            )}
          />
          <View style={tw`h-0.5 w-0.5`} />
          <View
            style={tw.style(
              'h-0.5 w-[5.125rem] border-t-2 border-white',
              progressStep < 4 && 'opacity-30',
            )}
          />
        </View>
        {isBackAvailable && (
          <View style={tw`absolute pt-9 pl-6 left-0 z-10`}>
            <Pressable hitSlop={20} onPress={() => navigation.dispatch(CommonActions.goBack())}>
              <Feather name="arrow-left" size={24} color="white" />
            </Pressable>
          </View>
        )}
        <MediumText style={tw`pt-9 text-white`}>{title}</MediumText>
      </View>
    </SafeAreaView>
  );
}
