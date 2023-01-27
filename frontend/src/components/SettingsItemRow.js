import React from 'react';
import { View } from 'react-native';
import MainText from './MainText';
import tw from 'twrnc';
import MediumText from './MediumText';

export default function SettingsItemRow({ title, content, icon = null }) {
  return (
    <View style={tw`w-full border-b border-white/10`}>
      <View style={tw`items-center justify-between flex-row p-6`}>
        <View style={tw`pl-2 items-start`}>
          <MainText>{title}</MainText>
          <MediumText style={tw`text-white pt-1`}>{content}</MediumText>
        </View>
        {icon}
      </View>
    </View>
  );
}
