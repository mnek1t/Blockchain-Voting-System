import Header from "../components/Header/Header";
import Contact from "../components/Contact/Contact";
import { useState, useEffect } from "react";
import { getElectionAll } from '../api/offChain/db-api-service';
import ElectionsView from "../components/ElectionsView/ElectionsView";
import { ElectionResponse } from "../types";
import { useUser } from "../AuthContext";
const VotingPage = () => {
    const {user} = useUser();
    const [elections, setElections] = useState<ElectionResponse[]>([]);
    useEffect(() => {
        getElectionAll()
        .then((data) => { 
            console.log(data);
            setElections(data)
        })
        .catch((err) => console.error(err))
    }, [])

    return(
    <div className="app-container">
        <Header/>
        <hr/>
        <a href={`/${user && user.role}/home`}>&lt; To home page</a>
        <ElectionsView elections={elections}/>
        <Contact/>
    </div>
    );
}

export default VotingPage;