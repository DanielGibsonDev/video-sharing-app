import React, { useContext, useEffect, useRef, useState } from 'react';
import tw from 'twrnc';
import { Video } from 'expo-av';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MainText from './MainText';
import { Feather, Ionicons } from '@expo/vector-icons';
import muxReactNativeVideo from '@mux/mux-data-react-native-video';
import { StateContext } from '../utils/Context/StateContext';
import { functions, httpsCallable } from '../../firebaseConfig';

const formatDate = (timestamp) => {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);
};

const MuxVideo = muxReactNativeVideo(Video);

export default function PostSingle({ videoInfo }) {
  const [user, , , , , , teamUsers] = useContext(StateContext);
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [realTimeViews, setRealTimeViews] = useState(0);
  const [videoViews, setVideoViews] = useState(0);
  const [createdByUser, setCreatedByUser] = useState();
  const defaultScreenRatio = Dimensions.get('window').width / Dimensions.get('window').height;

  useEffect(() => {
    setCreatedByUser(teamUsers.find((teamUser) => teamUser.id === videoInfo.created_by));
  }, [teamUsers, videoInfo.created_by]);

  useEffect(() => {
    if (createdByUser) {
      const fetchRealTimeViews = async () => {
        try {
          const realTimeViewsFunction = await httpsCallable(functions, 'getRealTimeViewCount');
          const { data } = await realTimeViewsFunction({ playbackId: videoInfo.playback_id });
          setRealTimeViews(data[0].views);
        } catch (error) {
          console.error('Unable to fetch real time views data -> ', error);
        }
      };
      fetchRealTimeViews();
    }
  }, [videoInfo.playback_id, createdByUser]);

  useEffect(() => {
    if (videoInfo.id && createdByUser) {
      const fetchVideoViews = async () => {
        try {
          const videoViewsFunction = httpsCallable(functions, 'getVideoViews');
          const { data } = await videoViewsFunction({ video_id: videoInfo.id });
          setVideoViews(data.total_row_count ? data.total_row_count : 0);
        } catch (error) {
          console.error('Unable to fetch view count data -> ', error);
        }
      };
      fetchVideoViews();
    }
  }, [videoInfo.id, createdByUser]);

  if (!createdByUser) {
    return;
  }

  return (
    <View style={tw`pt-4 mb-6 border-t border-white/20`}>
      <View style={tw`flex-row justify-between pt-3`}>
        <View style={tw`pl-6.5 pb-5 flex-row`}>
          {createdByUser?.picture ? (
            <Image source={{ uri: createdByUser.picture }} style={tw`w-10 h-10 rounded-full`} />
          ) : (
            <FontAwesome name="user-circle" size={40} color="white" />
          )}
          <View style={tw`pl-2.5 items-start`}>
            <MainText>{createdByUser?.name}</MainText>
            <Text
              style={tw.style('text-white opacity-60 pt-0.5', { fontFamily: 'Inter_300Light' })}
            >
              {formatDate(videoInfo.created_at)}
            </Text>
          </View>
        </View>
      </View>

      <View>
        <MuxVideo
          ref={video}
          style={tw.style('w-full bg-black', { aspectRatio: 9 / 16 })}
          resizeMode="contain"
          isLooping
          useNativeControls
          onPlaybackStatusUpdate={(statusUpdate) => setStatus(() => statusUpdate)}
          usePoster
          posterSource={{
            uri: `https://image.mux.com/${videoInfo.playback_id}/thumbnail.png`,
          }}
          posterStyle={tw.style('h-full flex-1 w-full bg-black', { resizeMode: 'cover' })}
          source={{
            uri: `https://stream.mux.com/${videoInfo.playback_id}.m3u8`,
          }}
          videoStyle={tw``}
          muxOptions={{
            application_name: Platform.OS == 'ios' ? 'Pals iOS Mobile' : 'Pals Android Mobile',
            application_version: '1.0.0',
            data: {
              env_key: '4jb27o935h43pn4k96s0n8i58',
              video_id: videoInfo.id,
              video_title: videoInfo.id,
              viewer_user_id: user.id,
              video_duration: videoInfo.duration,
              player_name: 'Expo AV Video Player - Mobile app',
            },
          }}
        />

        {!status.isLoaded && (
          <View style={tw`absolute items-center justify-center left-0 top-0 right-0 bottom-0`}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}

        {!status.isPlaying && status.positionMillis === 0 && (
          <View style={tw`absolute items-center justify-center left-0 top-0 right-0 bottom-0`}>
            <Pressable style={tw``} hitSlop={50} onPress={() => video?.current?.playAsync()}>
              <Feather name="play-circle" size={50} color="white" />
            </Pressable>
          </View>
        )}
      </View>

      <View style={tw`flex-row items-center pt-5 pl-6 z-10`}>
        <Ionicons name="eye" size={15} color="white" style={tw`opacity-60 pr-1.5`} />
        <MainText style={tw`opacity-60 text-xs`}>
          {videoViews} view{videoViews === 1 ? '' : 's'} (in last 30 days) - {realTimeViews}{' '}
          currently watching
        </MainText>
      </View>
      {videoInfo.caption && (
        <View>
          <Text style={tw.style('text-sm text-white px-6 pt-2', { fontFamily: 'Inter_300Light' })}>
            {videoInfo.caption}
          </Text>
        </View>
      )}
    </View>
  );
}
