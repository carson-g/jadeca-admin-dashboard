import React from 'react';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import './AdminDashboard.css';

const NotAdmin = () => {

  const handleSignout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">You are not an admin.</h1>
        <button className="signout-button" onClick={handleSignout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default NotAdmin;
