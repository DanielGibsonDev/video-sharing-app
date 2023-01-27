import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, documentId, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

export const useFetchUser = ({ setUser }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    let isCancelled = false;

    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (!isCancelled && storedUser) {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where(documentId(), '==', JSON.parse(storedUser).id));
          const querySnapPromise = await getDocs(q);
          const queryData = await querySnapPromise;
          if (!queryData.empty) {
            const id = queryData.docs[0].id;
            const userData = queryData.docs[0].data();
            setUser({
              id,
              ...userData,
            });
          }
        }
      } catch (e) {
        console.error('error fetching user from database or local storage ', e);
        setError(e);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, []);

  return [isLoading, error];
};
