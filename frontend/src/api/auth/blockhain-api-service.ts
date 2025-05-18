import axios, { AxiosResponse } from 'axios'
import { BasicLoginCredentials } from './blockchain-api-definitions'

const basicLogin = async ({personalNumber, password}: BasicLoginCredentials) => {
    try{
        const response : AxiosResponse =  await axios.post(process.env.REACT_APP_NODE_URL + "/api/auth/login", {personalNumber, password},  { withCredentials: true });
        if(response.status === 201) {
            return response.data;
        } else {
            throw new Error(`${response.status} Error`);
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.error || error.message || "Login error";
            console.error("Login error:", { status, message });
            throw new Error(
                status === 401
                    ? "Invalid personal number or password."
                    : status === 500
                    ? "Server error. Please try again later."
                    : message
            );
        } else {
            console.error("Unexpected login error:", error);
            throw new Error("An unexpected error occurred during login.");
        }
    }
}

const logout = async () => {
    try {
        const response : AxiosResponse = await axios.post(process.env.REACT_APP_NODE_URL + "/api/auth/logout", {}, {withCredentials: true});
        if(response.status === 201) {
            return response.data;
        } else {
            throw new Error("Logout failed");
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const serverMessage = error.response?.data?.error || error.message;

            throw new Error(
                status === 401
                    ? "Session expired. Please log in again."
                    : status === 500
                    ? "Server error occurred. Try again later."
                    : serverMessage
            );
        } else {
            throw new Error("Something went wrong. Please try again.");
        }
    }
}
const getMe = async () => {
    try {
        const response : AxiosResponse = await axios.get(process.env.REACT_APP_NODE_URL + "/api/auth/user/me", {withCredentials: true});
        if(response.status === 200) {
            return response.data;
        } else {
            throw new Error('Get auth user data failed');
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.error || error.message || "Error fetching user data";
            console.error("getMe error:", { status, message });
            throw new Error(
                status === 401
                    ? "You are not authorized. Please log in again."
                    : status === 500
                    ? "Server error. Please try again later."
                    : message
            );
        } else {
            console.error("Unexpected error in getMe:", error);
            throw new Error("An unexpected error occurred while fetching user data.");
        }
    }
}

const validateToken = async() => {
    try {
        const response : AxiosResponse = await axios.get(process.env.REACT_APP_NODE_URL + "/api/auth/validateToken", {withCredentials: true});
        if(response.status === 200) {
            console.log("Token is valid")
            return true;
        } else {
            throw new Error("Token is not valid");
        }
    } catch(error) {
        console.error(error)
    }
}
export {basicLogin, logout, getMe, validateToken}