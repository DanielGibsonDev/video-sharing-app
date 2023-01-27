import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

export const useFetchTeam = ({ user, setTeam, isLoadingUser }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    let isCancelled = false;
    if (!isLoadingUser) {
      (async () => {
        try {
          if (user?.id) {
            const teamRef = collection(db, 'teams');
            const q = query(teamRef, where('user_ids', 'array-contains', user.id));
            const querySnapPromise = await getDocs(q);
            const { empty, docs } = await querySnapPromise;
            if (!empty && !isCancelled) {
              // A user should only be associated with one team hence we fetch item 0
              const id = docs[0].id;
              const teamData = docs[0].data();
              setTeam({
                id,
                ...teamData,
              });
            }
          }
        } catch (e) {
          console.error('error fetching team from database');
          setError(e);
        } finally {
          setIsLoading(false);
        }
      })();
    }
    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingUser, user?.id]);

  return [isLoading, error];
};
