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
const VotingDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [election, setElection] = useState<ElectionResponse>();
    const [connectedAccount, setConnectedAccount] = useState<string>();
    useEffect(() => {
        if(!id) return;

        getElectionById(id)
        .then((election) => {
            console.log(election)
            setElection(election)
        })
        .catch((err) => console.error(err))
    }, []);

    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        if (!election?.end_time) return;

        const update = () => {
            setTimeLeft(getTimeLeft(election.end_time));
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
    return(
        <div className="app-container">
        <Header/>
        <hr/>
        <a href="/voter/voting">&lt; To voting list</a>
        <h6>This is Voter view. Please read instructions before voting</h6>
        <h3>Metamask account connected: {connectedAccount}</h3>
        <StandardButton label="Connect Metamask" className="button-blue" onClick={handleConnectWallet}/>
        <h5>Voting will be finished on {formatDate(election?.end_time)}. {timeLeft} left</h5>
        {election && <VotingView candidates={election.Candidates} contractAddress={election.contract_address}/>}
        <Contact/>
        </div>
    )
}

export default VotingDetailPage