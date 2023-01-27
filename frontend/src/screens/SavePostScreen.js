import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';
import MainPressable from '../components/MainPressable';
import SecondaryText from '../components/SecondaryText';
import SecondaryPressable from '../components/SecondaryPressable';

export default function SavePostScreen({ navigation, route }) {
  const { source, sourceThumb } = route.params;
  const textInputRef = useRef();
  const [postCaption, setPostCaption] = useState();
  const [keyboardStatus, setKeyboardStatus] = useState('Keyboard Hidden');
  const WINDOW_WIDTH = useWindowDimensions().width;

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus('Keyboard Shown');
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus('Keyboard Hidden');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View style={tw`bg-black flex-1 justify-center items-center`}>
      <View
        style={tw.style('mt-10', {
          height: Math.round((WINDOW_WIDTH * 16) / 9),
        })}
      >
        <Image
          style={tw.style('flex-1', {
            aspectRatio: 9 / 16,
          })}
          source={{ uri: sourceThumb }}
        />
      </View>

      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'ios' ? 10 : 0}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={tw`absolute w-full bottom-10`}
      >
        {keyboardStatus === 'Keyboard Shown' ? (
          <SecondaryPressable onPress={Keyboard.dismiss} style={tw`w-24 self-end p-6 my-0 `}>
            <Text style={tw.style('text-white text-base', { fontFamily: 'Inter_500Medium' })}>
              Done
            </Text>
          </SecondaryPressable>
        ) : (
          <MainPressable
            onPress={() =>
              navigation.navigate('TeamScreen', { videoToUpload: source, postCaption })
            }
            style={tw`flex-row justify-center w-full w-2/5 self-end mr-6`}
          >
            <SecondaryText style={tw.style('pr-1')}>Post video</SecondaryText>
            <Feather name="arrow-right" size={20} color="black" style={tw``} />
          </MainPressable>
        )}

        <View style={tw`flex-1 border-t mb-4 border-white/20`}>
          <View style={tw`absolute w-full h-80 bg-black opacity-30`} />
          <TextInput
            placeholder="Write a caption..."
            placeholderTextColor="grey"
            selectionColor="grey"
            ref={textInputRef}
            onChangeText={(userInput) => setPostCaption(userInput)}
            defaultValue={postCaption}
            style={tw.style('text-white text-base p-6', { fontFamily: 'Inter_400Regular' })}
            maxLength={100}
            keyboardAppearance="dark"
            autoCapitalize="sentences"
            multiline
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
