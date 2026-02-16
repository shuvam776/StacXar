import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';
import GoogleButton from '../components/GoogleButton';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);

        if (!auth) {
            setTimeout(() => {
                console.warn(" Firebase has some problem");
                navigate('/'); // Navigate to home as if logged in
                setLoading(false);
            }, 1000);
            return;
        }

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log("Logged in user", user.email);
            navigate('/');
        } catch (err: any) {
            console.error("Login failed", err);
            setError(err.message || "Failed to login");
        } finally {
            if (auth) setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative bg-black">
            {/* Background enhancement */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black z-0"></div>

            <div className="z-10 text-center p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 w-full max-w-md animate-fade-in">
                <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
                <p className="text-gray-400 mb-8">Sign in to continue to StacXar</p>

                {!auth && (
                    <div className="mb-4 p-2 bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 rounded text-xs">
                        Some problem in env
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded text-sm">
                        {error}
                    </div>
                )}

                <div className="flex justify-center">
                    <GoogleButton onClick={handleGoogleLogin} isLoading={loading} />
                </div>
            </div>
        </div>
    );
};

export default Login;
