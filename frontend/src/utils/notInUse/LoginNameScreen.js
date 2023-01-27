import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import tw from 'twrnc';
import MainSafeAreaView from '../../components/MainSafeAreaView';
import MainView from '../../components/MainView';
import MainText from '../../components/MainText';
import MainPressable from '../../components/MainPressable';
import MediumText from '../../components/MediumText';

export default function LoginNameScreen({ navigation }) {
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
    <MainSafeAreaView>
      <MainView style={tw`mt-10`}>
        <MainText style={tw`px-6 mb-6`}>This will show on your profile as your username</MainText>
        <TextInput
          placeholder="Enter name"
          placeholderTextColor={'grey'}
          selectionColor={'grey'}
          ref={textInputRef}
          onChangeText={(userInput) => setUserName(userInput)}
          defaultValue={userName}
          style={tw.style('text-3xl font-bold text-white', { fontFamily: 'Inter_400Regular' })}
          autoComplete={'name'}
          autoFocus
          maxLength={20}
          keyboardAppearance={'dark'}
          autoCapitalize="words"
        />
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
          <MediumText style={tw.style(isDisabled && 'text-white opacity-50')}>Continue</MediumText>
        </MainPressable>
      </KeyboardAvoidingView>
    </MainSafeAreaView>
  );
}
