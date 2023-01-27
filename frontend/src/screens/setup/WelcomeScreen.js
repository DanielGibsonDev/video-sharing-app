import React, { useContext, useEffect, useRef, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import tw from 'twrnc';
import MainPressable from '../../components/MainPressable';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated, Image, View } from 'react-native';
import { StateContext } from '../../utils/Context/StateContext';
import MediumText from '../../components/MediumText';
import MainText from '../../components/MainText';

WebBrowser.maybeCompleteAuthSession();

export default function WelcomeScreen() {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [_, setUser] = useContext(StateContext);

  const animatedViewRef = useRef(new Animated.Value(0)).current;

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '68554319859-52u0mnje71iginjmbfsjskrjm3g0djaa.apps.googleusercontent.com',
    webClientId: '68554319859-l40ma8hs8ct5ap51kotam1ns4q2kmmom.apps.googleusercontent.com',
    iosClientId: '68554319859-c4n4focg0jufhg8q8mrt4oaf4rpp1u5c.apps.googleusercontent.com',
    androidClientId: '68554319859-c4jdnl4e8d2bkt61pm7pittfqo8bqe32.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      setIsLoading(true);
      const { authentication } = response;
      authentication && setAccessToken(authentication.accessToken);
    }
  }, [response]);

  useEffect(() => {
    if (accessToken) {
      const getUserData = async () => {
        try {
          const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const userData = await userInfoResponse.json();

          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          const userRef = doc(db, 'users', userData.id);
          await setDoc(userRef, userData, { merge: true });
          setUser(userData);
        } catch (error) {
          console.error('error trying to login with Google ', error);
        }
      };
      getUserData().catch((error) =>
        console.error('unable to fetch Google signin user data ', error),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedViewRef, {
          toValue: -175,
          duration: 500,
          delay: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedViewRef, {
          toValue: -175 * 2,
          duration: 500,
          delay: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedViewRef, {
          toValue: -175 * 3,
          duration: 500,
          delay: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [animatedViewRef]);

  return (
    <>
      <View style={tw`h-1/5 w-full bg-black z-10`} />
      <View style={tw`h-1/5 w-full bg-black`} />

      <View style={tw`h-3/5 items-center bg-black z-10`}>
        <MainText style={tw`px-10 mt-8`}>
          Connect with your workplace teams through daily video sharing. Record and share video
          clips and watch clips from your team.
        </MainText>

        {isLoading ? (
          <MediumText style={tw`mt-10 text-white`}>Signing into Google...</MediumText>
        ) : (
          <MainPressable
            style={tw.style('justify-center', {
              backgroundColor: '#4285F4',
            })}
            onPress={() => promptAsync({ useProxy: true })}
            disabled={!request}
          >
            <FontAwesome name="google" size={32} color="white" style={tw`absolute left-8`} />
            <MediumText style={tw`text-white pl-2`}>Continue with Google</MediumText>
          </MainPressable>
        )}

      </View>

      <Animated.View
        style={tw.style('absolute w-full top-50 items-center', {
          transform: [{ translateY: animatedViewRef }],
        })}
      >
        <View style={tw.style('items-center', { transform: [{ translateY: 0 }] })}>
          <Image source={require('../../../assets/video-icon-welcome.png')} />
          <MainText style={tw`mt-6 text-3xl text-[#BCE7FD]`}>Record.</MainText>
        </View>

        <View
          style={tw.style('items-center', {
            transform: [{ translateY: 35 }],
          })}
        >
          <Image source={require('../../../assets/share-icon.png')} />
          <MainText style={tw`mt-6 text-3xl text-[#BCE7FD]`}>Share.</MainText>
        </View>

        <View
          style={tw.style('items-center', {
            transform: [{ translateY: 70 }],
          })}
        >
          <Image source={require('../../../assets/watch-icon.png')} />
          <MainText style={tw`mt-6 text-3xl text-[#BCE7FD]`}>Watch.</MainText>
        </View>

        <View
          style={tw.style('items-center', {
            transform: [{ translateY: 105 }],
          })}
        >
          <Image source={require('../../../assets/video-icon-welcome.png')} />
          <MainText style={tw`mt-8 text-3xl text-[#BCE7FD]`}>Record.</MainText>
        </View>
      </Animated.View>
    </>
  );
}
