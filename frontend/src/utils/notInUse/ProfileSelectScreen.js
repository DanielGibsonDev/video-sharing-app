import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Text } from 'react-native';
import tw from 'twrnc';
import MainSafeAreaView from '../../components/MainSafeAreaView';
import MainView from '../../components/MainView';
import MainText from '../../components/MainText';
import MainPressable from '../../components/MainPressable';
import { Feather } from '@expo/vector-icons';

export default function ProfileSelectScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const textInputRef = useRef();
  const isDisabled = userName.length < 3 || userName.length > 18;

  useEffect(() => {
    if (textInputRef.current) {
      const unsubscribe = navigation.addListener('focus', () => {
        textInputRef.current.focus();
      });

      return unsubscribe;
    }
  }, [navigation, textInputRef]);

  return (
    <MainSafeAreaView style={tw``}>
      <MainView style={tw`mt-10`}>
        <MainText style={tw.style('px-6 mb-6')}>
          This will show on your profile as your avatar
        </MainText>
        <Feather name="user-plus" size={26} color="white" />
      </MainView>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'ios' ? 10 : 0}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={tw`items-center flex-1 justify-end`}
      >
        <MainPressable
          style={tw.style('', isDisabled ? 'bg-[#333333]' : 'bg-white')}
          onPress={() => navigation.navigate('LoginPhoneScreen', { userName })}
          disabled={isDisabled}
        >
          <Text
            style={tw.style('text-base', isDisabled ? 'text-white opacity-50' : 'text-black', {
              fontFamily: 'Inter_500Medium',
            })}
          >
            Continue
          </Text>
        </MainPressable>
      </KeyboardAvoidingView>
    </MainSafeAreaView>
  );
}
