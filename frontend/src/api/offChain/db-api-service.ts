import axios, { AxiosResponse } from 'axios'
import { AnnounceElectionPayload } from './db-api-definitions'

const saveElection = async ({contractAddress, title, candidates, duration, status}: AnnounceElectionPayload) => {
    try{
        const response : AxiosResponse =  await axios.post(process.env.REACT_APP_NODE_URL + "/api/election/save", {contractAddress, title, candidates, duration, status},  { withCredentials: true });
        if(response.status === 201 || response.status === 200) {
            return response.data;
        } else {
            throw new Error("Contract saving failed");
        }
    } catch (error) {
        console.error(error);
    }
}

const updateElection = async (contractAddress: string, status: string) => {
    try{
        const response : AxiosResponse =  await axios.patch(process.env.REACT_APP_NODE_URL + "/api/election/update", {contractAddress, status},  { withCredentials: true });
        if(response.status === 200) {
            return response.data;
        } else {
            throw new Error("Contract update failed");
        }
    } catch (error) {
        console.error(error);
    }
}

const getElectionById = async (id: string) => {
    try {
        const response: AxiosResponse = await axios.get(
            `${process.env.REACT_APP_NODE_URL}/api/election/${id}`,
            { withCredentials: true }
        );

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Election retrieval failed");
        }
    } catch (error) {
        console.error("Error fetching election by ID:", error);
        throw error;
    }
};

const getElectionAll = async() => {
    try{
        const response : AxiosResponse =  await axios.get(process.env.REACT_APP_NODE_URL + "/api/election/all", { withCredentials: true });
        if(response.status === 201 || response.status === 200) {
            return response.data;
        } else {
            throw new Error("Elections retreival failed");
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.error || error.message || "Error fetching user data";
            throw new Error(
                status === 401
                    ? "You are not authorized. Please log in again."
                    : status === 500
                    ? "Server error. Please try again later."
                    : message
            );
        } else {
            throw new Error("An unexpected error occurred while fetching user data.");
        }
    }
}
export {saveElection, getElectionById, getElectionAll, updateElection}
