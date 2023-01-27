import { useContext, useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { StateContext } from '../Context/StateContext';

export const useFetchVideos = () => {
  const [user, setUser, team, setTeam, videos, setVideos] = useContext(StateContext);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        if (team?.video_ids?.length > 0) {
          const videoRef = collection(db, 'videos');
          const q = query(videoRef, where('team_id', '==', team.id), orderBy('created_at', 'desc'));
          const querySnapPromise = await getDocs(q);
          const { empty, docs } = await querySnapPromise;
          if (!empty && !isCancelled) {
            const videosData = [];
            docs.forEach((video) => {
              const data = {
                id: video.id,
                ...video.data(),
              };
              videosData.push(data);
            });
            setVideos(videosData);
          }

          // subscribe to Firestore updates for upload status changes
          const unsubscribeFromWatchingDocChanges = onSnapshot(q, (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
              if (change.type === 'modified') {
                const updatedData = change.doc.data();
                if (updatedData.upload_status === 'ready') {
                  // Update context
                  setVideos((prevVideos) =>
                    prevVideos.map((video) => {
                      if (video.id === change.doc.id) {
                        return { ...video, ...updatedData };
                      }
                      return video;
                    }),
                  );
                }
              }
            });
          });
          return unsubscribeFromWatchingDocChanges;
        }
      } catch (e) {
        console.error('error fetching videos from database ', e);
        setError(e);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [team?.video_ids, team?.id]);

  return [isLoading, error];
};
