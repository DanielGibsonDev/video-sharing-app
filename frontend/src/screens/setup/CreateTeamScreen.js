import React, { useContext, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import randomWords from 'random-words';
import tw from 'twrnc';
import { db } from '../../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import MainPressable from '../../components/MainPressable';
import MainSafeAreaView from '../../components/MainSafeAreaView';
import MainView from '../../components/MainView';
import MainText from '../../components/MainText';
import { StateContext } from '../../utils/Context/StateContext';
import MediumText from '../../components/MediumText';
import SecondaryPressable from '../../components/SecondaryPressable';

const generateRandomWords = () =>
  randomWords({
    exactly: 3,
    maxLength: 6,
    formatter: (word) => word[0].toUpperCase() + word.slice(1),
    join: '',
  });

export default function CreateTeamScreen({ navigation }) {
  const [user, , , setTeam] = useContext(StateContext);
  const [teamName, setTeamName] = useState('');
  const textInputRef = useRef();

  useEffect(() => {
    if (textInputRef.current) {
      const unsubscribe = navigation.addListener('focus', () => {
        textInputRef.current.focus();
      });

      return unsubscribe;
    }
  }, [navigation, textInputRef]);

  const isDisabled = teamName.length < 3 || teamName.length > 20;

  const createTeam = () => {
    const customTeamId = generateRandomWords();
    const teamRef = doc(db, 'teams', customTeamId);
    setDoc(teamRef, { name: teamName.trim(), user_ids: [user.id] })
      .then(() => {
        navigation.navigate('SuccessJoinOrCreateScreen', {
          teamData: { id: teamRef.id, name: teamName.trim() },
        });
      })
      .catch((error) => console.error('add team error -> ', error));
  };

  return (
    <MainSafeAreaView>
      <MainView style={tw`mt-10`}>
        <MainText style={tw`px-6 mb-6`}>
          Create and name a new team that others will be able to join.
        </MainText>
        <TextInput
          placeholder="Enter team name"
          placeholderTextColor={'grey'}
          selectionColor={'grey'}
          ref={textInputRef}
          onChangeText={(userInput) => setTeamName(userInput)}
          defaultValue={teamName}
          style={tw.style('text-3xl font-bold text-white', { fontFamily: 'Inter_400Regular' })}
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
          style={tw.style('mb-6', isDisabled ? 'bg-[#333333]' : 'bg-white')}
          onPress={() => createTeam()}
          disabled={isDisabled}
        >
          <MediumText style={tw.style(isDisabled && 'text-white opacity-50')}>
            Create team
          </MediumText>
        </MainPressable>
        <SecondaryPressable style={tw`mt-0`} onPress={() => navigation.navigate('JoinTeamScreen')}>
          <MediumText style={tw`text-white`}>Or join an existing team</MediumText>
        </SecondaryPressable>
      </KeyboardAvoidingView>
    </MainSafeAreaView>
  );
}
