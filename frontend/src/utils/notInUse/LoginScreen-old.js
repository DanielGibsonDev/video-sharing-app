import React, { useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import tw from 'twrnc';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { PhoneSignIn } from './SignInPhone';

WebBrowser.maybeCompleteAuthSession();

/* Currently not in use - Signin with Google screen */
export default function LoginScreenOld({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   expoClientId: '68554319859-52u0mnje71iginjmbfsjskrjm3g0djaa.apps.googleusercontent.com',
  //   webClientId: '68554319859-l40ma8hs8ct5ap51kotam1ns4q2kmmom.apps.googleusercontent.com',
  //   iosClientId: '68554319859-c4n4focg0jufhg8q8mrt4oaf4rpp1u5c.apps.googleusercontent.com',
  //   androidClientId: '68554319859-c4jdnl4e8d2bkt61pm7pittfqo8bqe32.apps.googleusercontent.com',
  // });

  // const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  //   clientId: Constants.expoConfig.extra.googleClientId,
  // });

  /*
  Notes: - --
  Setup a DB.
  Store GoogleAuth Token and teams linked to them

  if we fetch a Google token and it is in our DB
   - then check if they have a team or not - Either CreateTeamScreen or TeamScreen
  if we fetch a Google token and it is not in our DB
    - Move to CreateTeamScreen
  If we don't fetch a Google token then ask to sign in
   - Once signed in then check if their token is in our DB
   - If so then check if they have a team or not - redirect accordingly
   */

  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     setIsLoading(true);
  //     const { authentication } = response;
  //     authentication && setAccessToken(authentication.accessToken);
  //   }
  // }, [response]);
  //
  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     setIsLoading(true);
  //     const { id_token } = response.params;
  //     const credential = GoogleAuthProvider.credential(id_token);
  //     signInWithCredential(auth, credential)
  //       .then((result) => {
  //         setUserInfo(result.user);
  //         navigation.navigate('CreateTeamScreen', { userInfo });
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [response]);

  // useEffect(() => {
  //   if (accessToken) {
  //     getUserData().catch(console.error);
  //     navigation.navigate('CreateTeamScreen', { userInfo });
  //     setIsLoading(false);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [accessToken, userInfo]);

  // const getUserData = async () => {
  //   const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
  //     headers: { Authorization: `Bearer ${accessToken}` },
  //   });
  //
  //   userInfoResponse.json().then((data) => {
  //     setUserInfo(data);
  //   });
  // };

  return (
    <SafeAreaView style={tw`h-full bg-black`}>
      <StatusBar style="light" />
      <View style={tw`items-center pt-10`}>
        <Text style={tw`text-white text-lg pb-10`}>Let's get started, login with Google!</Text>

        {isLoading ? (
          <Text style={tw`text-white`}>wait my friend...</Text>
        ) : (
          <Pressable
            style={tw.style('justify-center w-full py-4 mt-3 items-center rounded-2xl', {
              backgroundColor: '#4285F4',
            })}
            onPress={() => promptAsync({ useProxy: true })}
            disabled={!request}
          >
            <FontAwesome name="google" size={32} color="white" style={tw`absolute left-6`} />
            <Text style={tw`text-white text-lg pl-2`}>Continue with Google</Text>
          </Pressable>
        )}

        <Pressable
          style={tw`w-full py-4 mt-3 items-center`}
          onPress={() => navigation.navigate('CreateTeamScreen', { userInfo: null })}
        >
          <Text style={tw`text-white text-lg`}>or skip login</Text>
        </Pressable>

        <PhoneSignIn />
      </View>
    </SafeAreaView>
  );
}
