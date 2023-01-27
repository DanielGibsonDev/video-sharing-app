import React, { useContext, useEffect, useState } from 'react';
import { collection, documentId, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { StateContext } from '../Context/StateContext';

export const useFetchTeamUsers = () => {
  const [user, setUser, team, setTeam, videos, setVideos, teamUsers, setTeamUsers] =
    useContext(StateContext);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        if (team?.user_ids) {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where(documentId(), 'in', team.user_ids));
          const querySnapPromise = await getDocs(q);
          const { empty, docs } = await querySnapPromise;
          if (!empty && !isCancelled) {
            const listOfUsers = [];
            docs.forEach((userData) => {
              const data = {
                id: userData.id,
                ...userData.data(),
              };
              listOfUsers.push(data);
            });
            setTeamUsers(listOfUsers);
          }
        }
      } catch (e) {
        console.error('error fetching team users from database');
        setError(e);
      } finally {
        setIsLoading(false);
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, [team.user_ids, setTeamUsers]);

  return [isLoading, error];
};
