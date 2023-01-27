import React, { useContext, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import tw from 'twrnc';
import MainSafeAreaView from '../../components/MainSafeAreaView';
import MainView from '../../components/MainView';
import MainText from '../../components/MainText';
import MainPressable from '../../components/MainPressable';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { StateContext } from '../../utils/Context/StateContext';
import SecondaryPressable from '../../components/SecondaryPressable';
import MediumText from '../../components/MediumText';

export default function JoinTeamScreen({ navigation }) {
  const [user, setUser, team, setTeam, videos, setVideos] = useContext(StateContext);
  const [joinCode, setJoinCode] = useState('');
  const [hasError, setHasError] = useState(false);
  const textInputRef = useRef();

  useEffect(() => {
    if (textInputRef.current) {
      const unsubscribe = navigation.addListener('focus', () => {
        textInputRef.current.focus();
      });

      return unsubscribe;
    }
  }, [navigation, textInputRef]);

  const isDisabled = joinCode.length < 3 || joinCode.length > 20 || hasError;

  const joinTeam = () => {
    const teamRef = doc(db, 'teams', joinCode);
    const teamSnapPromise = getDoc(teamRef);

    teamSnapPromise
      .then((snapData) => {
        if (snapData.exists() && snapData.data()?.user_ids.length < 10) {
          updateDoc(teamRef, { user_ids: arrayUnion(user.id) });
          return snapData;
        } else {
          console.error("team code doesn't exist or team is full");
          setHasError(true);
        }
      })
      .then((snapData) => {
        if (snapData) {
          navigation.navigate('SuccessJoinOrCreateScreen', {
            teamData: { id: snapData.id, ...snapData.data() },
            hasJoinedTeam: true,
          });
        }
      })
      .catch((error) => console.error('join team error -> ', error));
  };

  return (
    <MainSafeAreaView>
      <MainView style={tw`mt-10`}>
        <MainText style={tw`px-6 mb-6`}>
          Join an existing team by entering the unique team code.
        </MainText>
        <TextInput
          placeholder="Enter team code"
          placeholderTextColor={'grey'}
          selectionColor={'grey'}
          ref={textInputRef}
          onChangeText={(userInput) => {
            setJoinCode(userInput);
            setHasError(false);
          }}
          defaultValue={joinCode}
          style={tw.style('text-3xl font-bold text-white', { fontFamily: 'Inter_400Regular' })}
          autoFocus
          maxLength={20}
          keyboardAppearance={'dark'}
        />
        {hasError && <MainText style={tw`text-red-600 -mb-7`}>Invalid team code</MainText>}
      </MainView>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'ios' ? 10 : 0}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={tw`items-center flex-1 justify-end`}
      >
        <MainPressable
          style={tw.style('mb-6', isDisabled ? 'bg-[#333333]' : 'bg-white')}
          onPress={() => joinTeam()}
          disabled={isDisabled}
        >
          <MediumText style={tw.style(isDisabled && 'text-white opacity-50')}>Continue</MediumText>
        </MainPressable>
        <SecondaryPressable
          style={tw`mt-0`}
          onPress={() => navigation.navigate('CreateTeamScreen')}
        >
          <MediumText style={tw`text-white`}>Or create a new team</MediumText>
        </SecondaryPressable>
      </KeyboardAvoidingView>
    </MainSafeAreaView>
  );
}
