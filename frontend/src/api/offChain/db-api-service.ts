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

const getElection = async () => {
    return('Get election');
}

const getElectionAll = async() => {
    return('Get All elections');
}
export {saveElection, getElection, getElectionAll}