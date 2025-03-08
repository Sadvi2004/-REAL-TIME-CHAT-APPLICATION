import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "./socket";
import { auth, db, storage } from "./Firebase";
import { signOut } from "firebase/auth";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Upload, Send, LogOut, XCircle } from "lucide-react";

const Chat = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const messagesRef = collection(db, "chat");

    useEffect(() => {
        const q = query(messagesRef, orderBy("timestamp"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const uploadImage = async (file) => {
        if (!file) return null;
        const storageRef = ref(storage, `chat_images/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const sendMessage = async () => {
        let imageUrl = "";
        if (selectedFile) {
            imageUrl = await uploadImage(selectedFile);
            setSelectedFile(null);
        }

        if (message.trim() !== "" || imageUrl) {
            const newMessage = {
                text: message,
                sender: user.displayName,
                file: imageUrl,
                timestamp: serverTimestamp(),
            };
            try {
                await addDoc(messagesRef, newMessage);
                socket.emit("send_message", newMessage);
            } catch (error) {
                console.error("Error sending message:", error);
            }
            setMessage("");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <div className="flex items-center justify-between bg-blue-600 p-4 text-white shadow-lg">
                <h2 className="text-xl font-bold">Chat App</h2>
                <button onClick={handleLogout} className="flex items-center space-x-2 hover:opacity-80">
                    <LogOut className="w-6 h-6" />
                    <span>Logout</span>
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`mb-3 ${msg.sender === user.displayName ? "text-right" : "text-left"}`}>
                        <div className={`inline-block p-3 rounded-lg shadow ${msg.sender === user.displayName ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
                            <strong>{msg.sender}:</strong> {msg.text}
                        </div>
                        {msg.file && <img src={msg.file} alt="Uploaded" className="w-32 mt-2 rounded-md shadow-lg" />}
                    </div>
                ))}
            </div>
            <div className="bg-white p-3 border-t flex items-center space-x-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none"
                />
                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} className="hidden" id="fileInput" />
                <label htmlFor="fileInput" className="cursor-pointer p-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                    <Upload className="w-5 h-5 text-gray-600" />
                </label>
                {selectedFile && (
                    <div className="relative">
                        <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-12 h-12 rounded-lg shadow-lg" />
                        <button onClick={() => setSelectedFile(null)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white">
                            <XCircle className="w-4 h-4" />
                        </button>
                    </div>
                )}
                <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-1">
                    <Send className="w-5 h-5" />
                    <span>Send</span>
                </button>
            </div>
        </div>
    );
};

export default Chat;
