import axios, { AxiosResponse } from 'axios'
import { BasicLoginCredentials } from './blockchain-api-definitions'

const basicLogin = async ({username, password}: BasicLoginCredentials) => {
    try{
        const response : AxiosResponse =  await axios.post(process.env.NODE_URL + "/login", {username, password});
        if(response.status === 201) {
            return response.data;
        } else {
            throw new Error("Login failed");
        }
    } catch (error) {
        console.error(error);
    }
}


const logout = async () => {
    try {
        const response : AxiosResponse = await axios.post(process.env.NODE_URL + "/logout", {}, {withCredentials: true});
        if(response.status === 201) {
            return response.data;
        } else {
            throw new Error("Logout failed");
        }
    } catch (error) {
        console.error(error);
    }
}

export {basicLogin, logout}