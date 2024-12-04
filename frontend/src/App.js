import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import NotAdmin from './components/NotAdmin';
import { auth, db } from './firebaseConfig';
import { getDocs, query, where, collection } from 'firebase/firestore';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      let uid;
      if (user) {
        uid = user.uid;
      }

      if (user) {
        const userCollection = collection(db, "users");
        const q = query(userCollection, where("uid", "==", uid));
        const userSnapshot = await getDocs(q);
        const user = userSnapshot.docs.map((doc) => doc.data());
        const userData = user[0];
        if (userData) {
          setIsAdmin(userData.role === 'admin');
        }
      } else {
        setIsAdmin(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div>
      {currentUser ? (isAdmin ? <AdminDashboard /> : <NotAdmin/>) : <Login />}
    </div>
  );
};

export default App;
