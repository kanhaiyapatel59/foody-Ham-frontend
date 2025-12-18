import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { auth, googleProvider, facebookProvider, appleProvider } from "../firebase"; 
import { signInWithPopup } from 'firebase/auth';
import LoadingSpinner from '../components/LoadingSpinner';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token && token !== "undefined") {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration and network errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle network errors
        if (!error.response) {
            error.message = 'Network error. Please check your connection.';
        }
        
        // Handle token expiration
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("tokenExpiration");
            localStorage.removeItem("user");
            localStorage.removeItem('foodyham_cart');
            window.location.href = '/login';
        }
        
        // Handle server errors
        if (error.response?.status >= 500) {
            error.message = 'Server error. Please try again later.';
        }
        
        return Promise.reject(error);
    }
);

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

/* =========================
Auth Provider
========================= */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const clearError = useCallback(() => setError(""), []);

    const updateAuth = useCallback((token, cleanUser) => {
        const userData = {
            ...cleanUser,
            isAdmin: cleanUser.role === "admin",
        };
        
        // Store token with expiration timestamp (30 days from now)
        const expirationTime = Date.now() + (30 * 24 * 60 * 60 * 1000);
        
        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpiration", expirationTime.toString());
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return userData;
    }, []); // Wrapped updateAuth in useCallback

    /* =========================
    INIT AUTH (ON APP LOAD)
    ========================= */
    useEffect(() => {
        const initAuth = async () => {
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("token");
            
            if (!storedUser || !storedToken || storedToken === "undefined" || isTokenExpired()) {
                if (isTokenExpired()) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("tokenExpiration");
                    localStorage.removeItem("user");
                    localStorage.removeItem('foodyham_cart');
                }
                setLoading(false);
                return;
            }
            
            try {
                const parsedUser = JSON.parse(storedUser);
                
                // Validate token by making a test request
                try {
                    await api.get('/auth/profile');
                    setUser({ ...parsedUser, isAdmin: parsedUser.role === 'admin' });
                } catch (tokenError) {
                    // Token is invalid/expired
                    console.log('Token validation failed, logging out');
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    localStorage.removeItem('foodyham_cart');
                    setUser(null);
                }
            } catch (e) {
                console.error("Error parsing stored user:", e);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                localStorage.removeItem('foodyham_cart');
                setUser(null);
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    /* =========================
    LOGIN (Refined)
    ========================= */
    const login = useCallback(async (email, password) => {
        setError("");
        try {
            const res = await api.post("/auth/login", { email, password });
            const backendUser = res.data.data;
            const token = backendUser.token;
            if (!token) {
                throw new Error("Token missing from backend");
            }
            const { token: _, ...cleanUser } = backendUser;
            return updateAuth(token, cleanUser);
        } catch (err) {
            const message = err.response?.data?.message || "Login failed. Please check your credentials.";
            setError(message);
            throw new Error(message);
        }
    }, [updateAuth]);


    /* =========================
    REGISTER (Refined)
    ========================= */
    const register = useCallback(async (name, email, password) => {
        setError("");
        try {
            const res = await api.post("/auth/register", { name, email, password });
            const backendUser = res.data.data;
            const token = backendUser.token;

            if (!token) {
                throw new Error("Token missing from backend");
            }
            
            const { token: _, ...cleanUser } = backendUser;

            return updateAuth(token, cleanUser);
        } catch (err) {
            const message = err.response?.data?.message || "Registration failed. Please try again.";
            setError(message);
            throw new Error(message);
        }
    }, [updateAuth]);

    /* =========================
    LOGOUT
    ========================= */
    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        localStorage.removeItem("user");
        localStorage.removeItem('foodyham_cart'); 
        setUser(null);
    }, []);

    /* =========================
    CHECK TOKEN EXPIRATION
    ========================= */
    const isTokenExpired = useCallback(() => {
        const expiration = localStorage.getItem("tokenExpiration");
        if (!expiration) return true;
        return Date.now() > parseInt(expiration);
    }, []);

    /* =========================
    UPDATE PROFILE (NEW IMPLEMENTATION)
    ========================= */
    const updateProfile = useCallback(async (profileData) => {
        setError("");
        try {

            const res = await api.put("/auth/profile", profileData);

            if (res.data.success) {
                const updatedUser = res.data.data;
                const token = localStorage.getItem("token") || updatedUser.token; // Keep old token or use new one if sent

                if (!token) {
                    throw new Error("Authentication token is missing.");
                }

                const { token: _, ...cleanUser } = updatedUser;
                const userData = { ...cleanUser, isAdmin: cleanUser.role === "admin" };
                
                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
                
                return userData;
            } else {
                throw new Error(res.data.message || "Failed to update profile.");
            }
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to update profile due to an error.";
            setError(message);
            throw new Error(message);
        }
    }, []);

    /* =========================
    CHANGE PASSWORD (FIXED IMPLEMENTATION)
    ========================= */
    const changePassword = useCallback(async (currentPassword, newPassword) => {
        setError("");
        try {
            const res = await api.put("/auth/password", {
                currentPassword,
                newPassword,
            });

            if (res.data.success) {
                return true; 
            } else {
                throw new Error(res.data.message || "Failed to change password.");
            }
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to change password due to an error.";
            setError(message);
            throw new Error(message);
        }
    }, []);

    /* =========================
    SOCIAL SIGN-IN METHODS
    ========================= */
    const socialSignIn = useCallback(async (provider, providerName) => {
        setError("");
        
        // Check if Firebase is configured
        if (!auth || !provider) {
            const message = `${providerName} authentication is not configured. Please set up Firebase credentials.`;
            setError(message);
            throw new Error(message);
        }
        
        try {
            // 1. Authenticate with Firebase
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // 2. Send Firebase ID Token to your backend for verification
            const idToken = await user.getIdToken();
            const response = await api.post('/auth/social', {
                token: idToken,
                provider: providerName
            });
            
            // 3. Handle response from your backend
            const backendUser = response.data.data;
            const token = backendUser.token;
            
            if (!token) {
                throw new Error(`Internal token missing after ${providerName} login.`);
            }
            
            const { token: _, ...cleanUser } = backendUser;
            return updateAuth(token, cleanUser);
        } catch (err) {
            if (err.code === 'auth/popup-closed-by-user') {
                setError(`${providerName} sign-in was closed.`);
            } else {
                const message = err.response?.data?.message || err.message || `${providerName} Sign-In failed.`;
                setError(message);
                throw new Error(message);
            }
        }
    }, [updateAuth]);

    const googleSignIn = useCallback(() => socialSignIn(googleProvider, 'Google'), [socialSignIn]);
    const facebookSignIn = useCallback(() => socialSignIn(facebookProvider, 'Facebook'), [socialSignIn]);
    const appleSignIn = useCallback(() => socialSignIn(appleProvider, 'Apple'), [socialSignIn]);


    /* =========================
    CONTEXT VALUE
    ========================= */
    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login,
                register,
                logout,
                clearError,
                updateProfile, 
                changePassword,

                isTokenExpired, 
            }}
        >
            {!loading && children}
            {loading && (
                <div className="min-h-screen flex items-center justify-center">
                    <LoadingSpinner size="lg" text="Loading application..." />
                </div>
            )}
        </AuthContext.Provider>
    );
};