import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [expandedEvent, setExpandedEvent] = useState(null);

  const fetchEvents = async () => {
    const eventsSnapshot = await getDocs(collection(db, 'events'));
    setEvents(eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchEvents();
    fetchUsers();
  }, []);

  const deleteEvent = async (id) => {
    try {
      await deleteDoc(doc(db, 'events', id));
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      fetchUsers();
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

  const toggleEventDetails = (id) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleString();
    }
    return '';
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
          <li className={`list-item ${expandedEvent === event.id ? 'expanded' : ''}`} key={event.id}>
            <div className="event-info">
              <span>{event.name}</span>
              <div className="event-actions">
                <button className="details-button" onClick={() => toggleEventDetails(event.id)}>
                  {expandedEvent === event.id ? 'Collapse' : 'Details'}
                </button>
                <button className="delete-button" onClick={() => deleteEvent(event.id)}>Delete</button>
              </div>
            </div>
            <div className="event-details">
              {expandedEvent === event.id && (
                <>
                  <p><strong>Description:</strong> {event.description}</p>
                  <p><strong>Date:</strong> {formatDate(event.date)}</p>
                  <p><strong>Points:</strong> {event.points}</p>
                </>
              )}
            </div>
          </li>
        ))}
        </ul>
        <h3 className="card-title">User Management</h3>
        <ul className="user-list">
          {users.map(user => (
            <li className="list-item" key={user.id}>
              <div className='event-info'>
                {user.email}
                <button className="delete-button" onClick={() => deleteUser(user.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
