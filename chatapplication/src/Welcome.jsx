import React from "react";
import { MessageCircle } from "lucide-react";
import Auth from "./Auth"; // Import the Auth component for login

const Welcome = ({ user, setUser }) => {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white">
            <MessageCircle size={80} className="mb-4" />
            <h1 className="text-3xl font-bold">Welcome to Chat App</h1>
            <p className="mt-2 text-lg">Connect with your friends instantly</p>
            {!user && <Auth setUser={setUser} />} {/* Show login button only if user is not logged in */}
        </div>
    );
};

export default Welcome;
