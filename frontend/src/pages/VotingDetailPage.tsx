import Header from "../components/Header/Header";
import Contact from "../components/Contact/Contact";
import { connectWallet } from "../api/blockchain/ethers";
import StandardButton from "../components/StandardButton/StandardButton";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { ElectionResponse } from "../types";
import { getElectionById } from "../api/offChain/db-api-service";
import VotingView from "../components/VotingView/VotingView";
import { formatDate, getTimeLeft } from "../utils/utils";
import { useUser } from "../AuthContext";
import ReferenceButton from "../components/ReferenceButton/ReferenceButton";
import CustomAlert from "../components/CustomAlert/CustomAlert";
import { useTranslation } from "react-i18next";

const VotingDetailPage = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [election, setElection] = useState<ElectionResponse>();
    const [connectedAccount, setConnectedAccount] = useState<string>();
    const { user } = useUser();
    const [status, setStatus] = useState<string | undefined>();
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<'error' | 'success' | 'info' | 'warning'>('error');
    useEffect(() => {
        if(!id) return;

        getElectionById(id)
        .then((election) => {
            console.log(election)
            setElection(election)
            setStatus(election.status)
        })
        .catch((err) => {
            setAlertMessage(err.message);
            setAlertSeverity('error')
        })
    }, []);

    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        if (!election?.end_time) return;

        const update = () => {
            setTimeLeft(getTimeLeft(election.end_time, t));
        };

        update();
        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, [election]);
    useEffect(() => {
        connectWallet()
        .then((data) => setConnectedAccount(data))
        .catch((err) => console.error(err))
    }, [])
    const handleConnectWallet = () => {
        connectWallet()
        .then((data) => setConnectedAccount(data))
        .catch((err) => console.error(err))
    } 
    const onStatusChange = (newValue: string) => {
        setStatus(newValue);
    }
    const translatedRole = t(`roles.${user?.role}`);
    return(
        <div className="app-container">
            <Header/>
            <hr/>
            <ReferenceButton destination="/votings" label={t("toVotingList")}/>
            {alertMessage ? 
                (
                    <CustomAlert alertMessage={alertMessage} alertSeverity={alertSeverity} setAlertMessage={() => setAlertMessage(null)}/>
                ) 
                    : 
                (
                    <>
                        <h6>{t("userViewMessage", { role: translatedRole })}</h6>
                        <h3>{t("metamaskAccount")}: {connectedAccount}</h3>
                        <StandardButton label={t("connectMetamask")} className="button-blue" onClick={handleConnectWallet}/>
                        <h5>{t("votingIsFinishedOn")} {formatDate(election?.end_time)}. {timeLeft}</h5>
                        {election && <VotingView electionId={election.election_id} candidates={election.Candidates} contractAddress={election.contract_address} status={election.status} role={user?.role} onStatusChange={onStatusChange}/>}
                        <Contact/>
                    </>
                )
            }
        </div>
    )
}

export default VotingDetailPage