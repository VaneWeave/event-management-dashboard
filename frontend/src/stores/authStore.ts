"use client";

import { create } from "zustand";
import axiosClient from "@/lib/axiosClient";


interface Admin {
    name: string;
    email: string;
}

interface AuthStore {
    admin: Admin | null;
    isAuthenticated: boolean;
    error: string | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    signUp: (
        name: string,
        email: string,
        password: string,
        key: string
    ) => Promise<void>;
    loginAdmin: (email: string, password: string) => Promise<void>;
    logoutAdmin: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    admin: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,

    signUp: async (
        name: string,
        email: string,
        password: string,
        key: string
    ) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosClient.post("/register", {
                name,
                email,
                password,
                key,
            });
            set({
                admin: response.data.admin,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Error Registering",
                isLoading: false,
            });
            throw error;
        }
    },

    loginAdmin: async (admin_email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosClient.post("/login", {
                admin_email,
                password,
            });
            set({
                admin: response.data.admin,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({
                error:
                    error instanceof Error ? error.message : "Error Logging In",
                isLoading: false,
            });
            throw error;
        }
    },

    logoutAdmin: async () => {
        set({ isLoading: true, error: null });
        try {
            await axiosClient.post("/logout");
            set({
                admin: null,
                isAuthenticated: false,
                isLoading: false,
            });
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Error Logging Out",
                isLoading: false,
            });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axiosClient.get("/check-auth");
            set({
                admin: response.data.admin,
                isAuthenticated: true,
                isCheckingAuth: false,
            });
        } catch (error) {
            set({
                isAuthenticated: false,
                isCheckingAuth: false,
            });
            throw error;
        }
    },
}));