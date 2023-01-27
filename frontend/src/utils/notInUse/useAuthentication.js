import React, { useEffect, useState } from 'react';
// import { auth } from '../../../firebaseConfig';

/* Currently not in use */
export const useAuthentication = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    // const unsubscribeFromAuthStateChanged = onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     // user is signed in
    //     setUser(user);
    //   } else {
    //     // user is signed out
    //     setUser(undefined);
    //   }
    // });
    // return unsubscribeFromAuthStateChanged;
  }, []);

  return {
    user,
  };
};
