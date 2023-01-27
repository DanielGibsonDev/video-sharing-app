import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import tw from 'twrnc';
import { useHeaderHeight } from '@react-navigation/elements';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import MainText from '../components/MainText';
import { StateContext } from '../utils/Context/StateContext';
import MainPressable from '../components/MainPressable';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useFetchTeamUsers } from '../utils/hooks/useFetchTeamUsers';
import { useFetchVideos } from '../utils/hooks/useFetchVideos';
import WelcomeBanner from '../components/WelcomeBanner';
import PostSingle from '../components/PostSingle';
import { useUploadPost } from '../utils/hooks/useUploadPost';
import { headerShadow } from '../utils/utils';

const RenderNoVideosYet = () => (
  <View style={tw`items-center mt-15`}>
    <Feather name="frown" size={24} color="white" style={tw`opacity-60`} />
    <MainText style={tw`pt-6 opacity-60`}>No videos yet</MainText>
  </View>
);

const RenderPostingInProgress = () => (
  <View style={tw`flex-row items-center mt-1 mb-6 w-full border-t-2 border-white/20`}>
    <View style={tw`absolute -top-0.5 w-2/5 border-t-2 border-blue-400`} />
    <Feather name="clock" size={18} color="white" style={tw`pr-3 pt-6 pl-6.5`} />
    <MainText style={tw`pt-6`}>Posting...</MainText>
  </View>
);

const RenderFinishedPosting = () => (
  <View style={tw`flex-row items-center mt-1 mb-6 w-full border-t-2 border-[#34D399]`}>
    <FontAwesome5 name="check-circle" size={18} color="white" style={tw`pr-3 pt-6 pl-6.5`} />
    <MainText style={tw`pt-6`}>Posted</MainText>
  </View>
);

export default function TeamScreen({ navigation, route }) {
  const [user, , team, , videos] = useContext(StateContext);

  const [isVideoStillUploading, setIsVideoStillUploading] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);

  const [isLoadingTeamUsers] = useFetchTeamUsers();
  const [isLoadingVideos] = useFetchVideos();
  const [isUploadingPost, newVideoId] = useUploadPost({
    videoSourceToUpload: route?.params?.videoToUpload,
    postCaption: route?.params?.postCaption,
  });

  const headerHeight = useHeaderHeight();

  useEffect(() => {
    if (!isLoadingVideos && !isLoadingTeamUsers) {
      setIsPageReady(true);
    }
  }, [isLoadingVideos, isLoadingTeamUsers]);

  useEffect(() => {
    const enableAudio = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: false,
      });
    };
    enableAudio();
  }, []);

  useEffect(() => {
    if (isUploadingPost) {
      return;
    }
    if (videos.find((video) => video.upload_status === 'waiting' && video.created_by === user.id)) {
      setIsVideoStillUploading(true);
      return;
    }
    setIsVideoStillUploading(false);
    if (!isUploadingPost && newVideoId) {
      if (route?.params?.videoToUpload) {
        const videoHasBeenPostedPrompt = setTimeout(() => {
          navigation.setParams({ videoToUpload: null, caption: null });
        }, 5000);
        return () => clearTimeout(videoHasBeenPostedPrompt);
      }
    }
  }, [isUploadingPost, videos, newVideoId, route?.params?.videoToUpload]);

  const renderItem = ({ item: video }) => {
    if (video.upload_status !== 'ready') {
      return;
    }
    return <PostSingle key={video.id} videoInfo={video} />;
  };

  return (
    <>
      <View style={headerShadow} />
      <View style={tw`bg-black h-full`} indicatorStyle="black">
        {isPageReady ? (
          <FlatList
            ListHeaderComponent={
              <View style={tw.style('items-center mt-2', { paddingTop: headerHeight })}>
                <View style={tw`flex-row mb-5`}>
                  <MainText style={tw`text-xs opacity-60`}>
                    {team.user_ids.length} team member{team.user_ids.length !== 1 && 's'} |{' '}
                    {videos.length} video{videos.length !== 1 && 's'}
                  </MainText>
                </View>
                <WelcomeBanner teamName={team.name} navigation={navigation} />
                <MainPressable
                  onPress={() => navigation.navigate('CameraScreen')}
                  style={tw`flex-row justify-center mt-3`}
                  hitSlop={5}
                >
                  <MainText style={tw`text-black`}>Record video</MainText>

                  <FontAwesome5 name="video" size={20} color="black" style={tw`pl-2.5`} />
                </MainPressable>

                {route?.params?.videoToUpload &&
                  (isUploadingPost || isVideoStillUploading ? (
                    <RenderPostingInProgress />
                  ) : (
                    <RenderFinishedPosting />
                  ))}
              </View>
            }
            ListEmptyComponent={<RenderNoVideosYet />}
            renderItem={renderItem}
            data={videos}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View style={tw`justify-center h-full`}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
      </View>
    </>
  );
}
