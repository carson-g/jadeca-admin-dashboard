import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);

      if (user) {
        // Check if the user is an admin
        const userDoc = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);
        
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
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
      {currentUser ? (isAdmin ? <AdminDashboard /> : <p>You do not have admin privileges.</p>) : <Login />}
    </div>
  );
};

export default App;
