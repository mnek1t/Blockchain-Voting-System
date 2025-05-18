import Header from "../components/Header/Header";
import Contact from "../components/Contact/Contact";
import { useState, useEffect } from "react";
import { getElectionAll } from '../api/offChain/db-api-service';
import ElectionsView from "../components/ElectionsView/ElectionsView";
import { ElectionResponse } from "../types";
import { useUser } from "../AuthContext";
import ReferenceButton from '../components/ReferenceButton/ReferenceButton';
import { Alert, AlertTitle } from "@mui/material";
const VotingPage = () => {
    const {user} = useUser();
    const [elections, setElections] = useState<ElectionResponse[]>([]);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<'error' | 'success' | 'info' | 'warning'>('error');
    useEffect(() => {
        getElectionAll()
        .then((data) => { 
            console.log(data);
            setElections(data)
        })
        .catch((err) => {
            setAlertMessage(err.message);
            setAlertSeverity('error')
        })
    }, [])

    return(
    <div className="app-container">
        <Header/>
        <hr/>
        <ReferenceButton label='To home page' destination={`/${user && user.role}/home`}/>
        {alertMessage ? 
            (<Alert severity={alertSeverity} onClose={() => {setAlertMessage(null)}}>
                <AlertTitle><strong>{alertMessage}</strong></AlertTitle>
                {alertSeverity !== 'success' && 'Please contact support team in case you have some questions!'}
            </Alert>) : 
            (<ElectionsView elections={elections}/>)
        }
        <Contact/>
    </div>
    );
}

export default VotingPage;