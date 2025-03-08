import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Auth from "./Auth";
import Chat from "./Chat";
import Welcome from "./Welcome";
import { auth } from "./Firebase";
import { onAuthStateChanged } from "firebase/auth"; // Import this function

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevent flickering

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop loading once user state is set
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading screen while checking auth

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/chat" /> : <Welcome setUser={setUser} />} />
        <Route path="/chat" element={user ? <Chat user={user} setUser={setUser} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
