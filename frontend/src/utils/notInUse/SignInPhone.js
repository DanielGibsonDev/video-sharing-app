import React, { useState } from 'react';
import { Pressable, Text, TextInput } from 'react-native';
import tw from 'twrnc';

/* Currently not in use - Firebase Phone verification */
export function PhoneSignIn() {
  // if null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  const [code, setCode] = useState('');

  // handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    // const confirmation = await auth
    //   .signInWithPhoneNumber(phoneNumber)
    //   .catch((error) => console.log('sign in phone error ->> ', error));
    // setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.error('confirmCode error - Invalid code -> ', error);
    }
  }

  if (!confirm) {
    return (
      <Pressable
        style={tw`w-full py-4 mt-3 items-center`}
        onPress={() => signInWithPhoneNumber('+6421234567')}
      >
        <Text style={tw`text-white text-lg`}>Phone Number Sign In</Text>
      </Pressable>
    );
  }

  return (
    <>
      <TextInput value={code} onChangeText={(text) => setCode(text)} />
      <Pressable style={tw`w-full py-4 mt-3 items-center`} onPress={() => confirmCode()}>
        <Text style={tw`text-white text-lg`}>Confirm Code</Text>
      </Pressable>
    </>
  );
}
