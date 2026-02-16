import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import type { User } from 'firebase/auth';

interface ProtectedRouteProps {
    children: React.ReactElement;
    user: User | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, user }) => {
    // We might need a loading state here if auth is initializing, 
    // but for now relying on the parent to pass user state effectively.
    // If user is strictly null, we redirect. 
    // Note: In a real app with proper loading state, we'd wait for auth check to complete.
    // For this implementation, we assume if user is null after init, they are logged out.
    // Ideally we should pass an 'isLoading' prop too.

    // Simplification: We'll rely on the parent (App.tsx) to handle the initial loading check if possible,
    // or we can use onAuthStateChanged here too, but passing down is cleaner.

    if (!user && auth?.currentUser === null) {
        // Double check against auth.currentUser to avoid premature redirects during load
        // But since we are passing user prop, we will trust it for now.
        // A better approach is to check if we are *sure* the user is logged out.
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
