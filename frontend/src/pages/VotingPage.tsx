import Header from "../components/Header/Header";
import Contact from "../components/Contact/Contact";
import { useState, useEffect } from "react";
import { getElectionAll } from '../api/offChain/db-api-service';
import ElectionsView from "../components/ElectionsView/ElectionsView";
import { ElectionResponse } from "../types";
import { useUser } from "../AuthContext";
import ReferenceButton from '../components/ReferenceButton/ReferenceButton';
import CustomAlert from "../components/CustomAlert/CustomAlert";
import { useTranslation } from "react-i18next";

const VotingPage = () => {
    const {t} = useTranslation();
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
        <ReferenceButton label={t("toHomePage")} destination={`/${user && user.role}/home`}/>
        {alertMessage ? 
            (<CustomAlert alertMessage={alertMessage} alertSeverity={alertSeverity} setAlertMessage={() => setAlertMessage(null)}/>) : 
            (<ElectionsView elections={elections}/>)
        }
        <Contact/>
    </div>
    );
}

export default VotingPage;