import React, { useContext, useEffect, useRef, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import MainSafeAreaView from '../../components/MainSafeAreaView';
import MainView from '../../components/MainView';
import tw from 'twrnc';
import { KeyboardAvoidingView, Platform, Text, TextInput } from 'react-native';
import MainPressable from '../../components/MainPressable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateContext } from '../../utils/Context/StateContext';

export default function LoginPhoneScreen({ navigation, route }) {
  const { userName } = route.params;
  const [, setUser] = useContext(StateContext);
  const [userPhone, setUserPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textInputRef = useRef();
  const isDisabled = userPhone.length < 3 || userPhone.length > 20 || isLoading;

  useEffect(() => {
    if (textInputRef.current) {
      const unsubscribe = navigation.addListener('focus', () => {
        textInputRef.current.focus();
      });

      return unsubscribe;
    }
  }, [navigation, textInputRef]);

  const handleNavigate = () => {
    setIsLoading(true);
    const userData = {
      name: userName,
      phone: userPhone,
      id: userPhone,
    };

    const fetchOrCreateUser = async () => {
      const userRef = doc(db, 'users', userPhone);
      return await setDoc(userRef, userData, { merge: true });
    };

    const storeData = async () => await AsyncStorage.setItem('userData', JSON.stringify(userData));

    fetchOrCreateUser()
      .then(() => {
        storeData().catch((error) => console.error('Async storage saving error', error));
        setUser(userData);
      })
      .catch((error) => console.error('fetchUser error -> ', error));
  };

  return (
    <MainSafeAreaView>
      <MainView style={tw`mt-10`}>
        <TextInput
          placeholder="Enter number"
          placeholderTextColor={'grey'}
          selectionColor={'grey'}
          ref={textInputRef}
          onChangeText={(userInput) => setUserPhone(userInput)}
          defaultValue={userPhone}
          style={tw.style('text-3xl font-bold text-white', { fontFamily: 'Inter_400Regular' })}
          autoComplete={'tel'}
          keyboardType={'phone-pad'}
          autoFocus
          maxLength={20}
          keyboardAppearance={'dark'}
        />
      </MainView>

      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'ios' ? 10 : 0}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={tw`items-center flex-1 justify-end`}
      >
        <MainPressable
          style={tw.style('', isDisabled ? 'bg-[#333333]' : 'bg-white')}
          onPress={() => handleNavigate()}
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
