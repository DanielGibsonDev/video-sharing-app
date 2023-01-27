import React from 'react';
import { Image, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import MainText from './MainText';
import tw from 'twrnc';

export default function SettingsItemRowUser({ teamUser, user }) {
  return (
    <View style={tw`w-full border-b border-white/10`}>
      <View style={tw`items-center flex-row p-6`}>
        {teamUser.picture ? (
          <Image source={{ uri: teamUser.picture }} style={tw`w-8 h-8 rounded-full`} />
        ) : (
          <Feather name="user" size={32} color="white" />
        )}
        <MainText style={tw`pl-2`}>
          {teamUser.name} {user.id === teamUser.id && '(you)'}
        </MainText>
      </View>
    </View>
  );
}
