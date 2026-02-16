import React from 'react';

interface GoogleButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    label?: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick, isLoading, label = "Continue with Google" }) => {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className="flex items-center justify-center bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-sm"
        >
            {isLoading ? (
                <span>Loading...</span>
            ) : (
                <>
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google logo"
                        className="w-6 h-6 mr-3"
                    />
                    <span>{label}</span>
                </>
            )}
        </button>
    );
};

export default GoogleButton;
