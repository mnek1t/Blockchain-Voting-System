import Header from "../components/Header/Header";
import Contact from "../components/Contact/Contact";
import { useState, useEffect } from "react";
import { getElectionAll } from '../api/offChain/db-api-service';
import ElectionsView from "../components/ElectionsView/ElectionsView";
import { ElectionResponse } from "../types";
import { useUser } from "../AuthContext";
import ReferenceButton from '../components/ReferenceButton/ReferenceButton';
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
        <ReferenceButton label='To home page' destination={`/${user && user.role}/home`}/>
        <ElectionsView elections={elections}/>
        <Contact/>
    </div>
    );
}

export default VotingPage;