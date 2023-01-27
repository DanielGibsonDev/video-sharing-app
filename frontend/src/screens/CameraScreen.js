import React, { useEffect, useState } from 'react';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { Audio } from 'expo-av';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { ActivityIndicator, Pressable, useWindowDimensions, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';

export default function CameraScreen() {
  const [hasCameraPermissions, setHasCameraPermissions] = useState(false);
  const [hasAudioPermissions, setHasAudioPermissions] = useState(false);

  const [cameraRef, setCameraRef] = useState(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [cameraFlash, setCameraFlash] = useState(FlashMode.off);

  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const WINDOW_WIDTH = useWindowDimensions().width;

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermissions(cameraStatus.status === 'granted');

      const audioStatus = await Audio.requestPermissionsAsync();
      setHasAudioPermissions(audioStatus.status === 'granted');
    })();
  }, []);

  const generateThumbnail = async (source) => {
    try {
      // Use time to select when to capture the thumbnail
      // const { uri } = await VideoThumbnails.getThumbnailAsync(source, { time: 1000 });
      const { uri } = await VideoThumbnails.getThumbnailAsync(source);
      return uri;
    } catch (error) {
      console.error('generate thumbnail error -> ', error);
    }
  };

  const recordVideo = async () => {
    setIsRecording(true);
    if (cameraRef) {
      try {
        const options = { maxDuration: 15, quality: Camera.Constants.VideoQuality['720'] };
        const videoRecordPromise = cameraRef.recordAsync(options);
        if (videoRecordPromise) {
          const { uri: source } = await videoRecordPromise;
          const sourceThumb = await generateThumbnail(source);
          navigation.navigate('SavePostScreen', { source, sourceThumb });
        }
      } catch (error) {
        console.error('record video error -> ', error);
      }
    }
  };

  const stopVideo = async () => {
    if (cameraRef) {
      cameraRef.stopRecording();
    }
    setIsRecording(false);
  };

  const toggleCameraType = () => {
    setCameraType((cameraType) =>
      cameraType === CameraType.back ? CameraType.front : CameraType.back,
    );
  };

  const toggleCameraFlash = () => {
    setCameraFlash(cameraFlash === FlashMode.off ? FlashMode.torch : FlashMode.off);
  };

  const handleCloseCamera = () => {
    navigation.navigate('TeamScreen');
  };

  if (!hasCameraPermissions || !hasAudioPermissions) {
    return <View />;
  }

  return (
    <View style={tw`bg-black flex-1 justify-center items-center`}>
      {isFocused ? (
        <View
          style={tw.style('mt-10', {
            height: Math.round((WINDOW_WIDTH * 16) / 9),
          })}
        >
          <Camera
            ref={(ref) => setCameraRef(ref)}
            style={tw.style('flex-1', {
              aspectRatio: 9 / 16,
            })}
            ratio={'16:9'}
            type={cameraType}
            flashMode={cameraFlash}
            onCameraReady={() => setIsCameraReady(true)}
          />
        </View>
      ) : (
        <ActivityIndicator size="large" color="white" />
      )}

      <View style={tw`absolute top-25 right-5 z-20`}>
        <Pressable onPress={handleCloseCamera} hitSlop={20}>
          <Feather name="x" size={36} color={'white'} />
        </Pressable>
      </View>

      <View style={tw`absolute bottom-20 left-15 z-10`}>
        <Pressable onPress={toggleCameraFlash} hitSlop={20}>
          <Feather
            name={cameraFlash === FlashMode.off ? 'zap-off' : 'zap'}
            size={36}
            color={'white'}
          />
        </Pressable>
      </View>

      <View style={tw`absolute bottom-20 right-15 z-10`}>
        <Pressable onPress={toggleCameraType} hitSlop={20}>
          <Feather name="refresh-ccw" size={36} color={'white'} />
        </Pressable>
      </View>

      <View style={tw`absolute bottom-15 left-0 right-0 items-center`}>
        <Pressable
          disabled={!isCameraReady}
          onPress={() => setIsRecording(true)}
          onLongPress={() => recordVideo()}
          onPressOut={() => stopVideo()}
          style={{
            borderWidth: 5,
            borderColor: 'white',
            backgroundColor: 'transparent',
            borderRadius: 100,
            height: 80,
            width: 80,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: isRecording ? '#ff4040' : 'white',
              borderRadius: 100,
              height: 65,
              width: 65,
            }}
          />
        </Pressable>
      </View>
    </View>
  );
}
