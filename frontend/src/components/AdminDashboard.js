import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsSnapshot = await getDocs(collection(db, 'events'));
      setEvents(eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchEvents();
    fetchUsers();
  }, []);

  const deleteEvent = async (id) => {
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

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
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <button className="signout-button" onClick={handleSignout}>
          Sign Out
        </button>
      </div>
      <div className="card">
        <h3 className="card-title">Event Management</h3>
        <ul className="event-list">
          {events.map(event => (
            <li className="list-item" key={event.id}>
              {event.name}
              <button onClick={() => deleteEvent(event.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <h3 className="card-title">User Management</h3>
        <ul className="user-list">
          {users.map(user => (
            <li className="list-item" key={user.id}>
              {user.email}
              <button onClick={() => deleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
