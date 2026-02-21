import { auth } from '../firebase/firebase';

const getApiBase = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    // Remove trailing slash if exists
    const sanitizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${sanitizedBase}/api`;
};

const API_BASE = getApiBase();

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

export const apiClient = {
    async fetch(endpoint: string, options: RequestOptions = {}) {
        const user = auth.currentUser;
        const headers = new Headers(options.headers || {});

        if (user?.email) {
            headers.set('user-email', user.email);
        }

        // Handle URL parameters
        let url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        if (options.params) {
            const searchParams = new URLSearchParams(options.params);
            url += `?${searchParams.toString()}`;
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const message = errorData.message || `Server error (${response.status})`;
            throw new Error(message);
        }

        return response.json();
    },

    get(endpoint: string, options: RequestOptions = {}) {
        return this.fetch(endpoint, { ...options, method: 'GET' });
    },

    post(endpoint: string, body: any, options: RequestOptions = {}) {
        const isFormData = body instanceof FormData;
        const headers = new Headers(options.headers || {});

        if (!isFormData) {
            headers.set('Content-Type', 'application/json');
        }

        return this.fetch(endpoint, {
            ...options,
            method: 'POST',
            headers,
            body: isFormData ? body : JSON.stringify(body),
        });
    }
};
