import React, { useContext, useEffect, useState } from 'react';
import { StateContext } from '../Context/StateContext';
import { db, functions, httpsCallable } from '../../../firebaseConfig';
import * as FileSystem from 'expo-file-system';
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';

export const useUploadPost = ({ videoSourceToUpload, postCaption }) => {
  const [user, setUser, team, setTeam, videos, setVideos] = useContext(StateContext);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    if (videoSourceToUpload) {
      (async () => {
        try {
          setIsLoading(true);
          console.log('Upload started. Generating signed URL from Mux...');
          const generateSignedUrl = httpsCallable(functions, 'generateSignedUrl');
          const { data: signedUploadUrl } = await generateSignedUrl();

          console.log('Success. Uploading file to signed Mux URL...');
          await FileSystem.uploadAsync(signedUploadUrl.url, videoSourceToUpload, {
            httpMethod: 'PUT',
          });

          console.log('Success. Updating database video and team...');
          const videoData = {
            created_by: user.id,
            upload_status: signedUploadUrl.status,
            upload_id: signedUploadUrl.id,
            team_id: team.id,
            created_at: Date.now(),
            caption: postCaption ? postCaption : '',
          };

          const { id } = await addDoc(collection(db, 'videos'), videoData);
          videoData.id = id;

          const teamRef = doc(db, 'teams', team.id);
          await updateDoc(teamRef, {
            video_ids: arrayUnion(videoData.id),
          });
          setTeam((prevTeam) => ({
            ...prevTeam,
            video_ids: prevTeam.video_ids ? [...prevTeam.video_ids, videoData.id] : [videoData.id],
          }));

          console.log('Success. Now finished the initial upload.');
          setData(videoData.id);
        } catch (error) {
          console.error('failed to handle upload -> ', error);
        } finally {
          setIsLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoSourceToUpload]);

  return [isLoading, data];
};
