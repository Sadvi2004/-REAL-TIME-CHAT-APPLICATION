import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "./Firebase";
import { useNavigate } from "react-router-dom";

const Auth = ({ setUser }) => {
    const navigate = useNavigate();

    const login = async () => {
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
        navigate("/chat");
    };

    return (
        <button
            onClick={login}
            className="mt-5 flex items-center bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
        >
            <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" className="w-6 h-6 mr-2" />
            Login with Google
        </button>
    );
};

export default Auth;
