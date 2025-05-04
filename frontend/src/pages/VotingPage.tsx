import Header from "../components/Header/Header";
import Contact from "../components/Contact/Contact";
import { useState, useEffect } from "react";
import { connectWallet } from "../api/blockchain/ethers";
import StandardButton from "../components/StandardButton/StandardButton";
type Candidate = {
    id: number;
    name: string;
    party: string;
    image: File | null;
    imagePreview: string;
};

const VotingPage = () => {
    const [candidates, setCandidates] = useState<Candidate[]>();
    const [connectedAccount, setConnectedAccount] = useState<string>();

    useEffect(() => {
        connectWallet()
        .then((data) => setConnectedAccount(data))
        .catch((err) => console.error(err))
    })

    const handleConnectWallet = () => {
        connectWallet()
        .then((data) => setConnectedAccount(data))
        .catch((err) => console.error(err))
    } 
    return(
    <div className="app-container">
        <Header/>
        <hr/>
        <a href="/voter/home">&lt; To home page</a>
        <h6>This is Voter view. Please read instructions before voting</h6>
        <label htmlFor="acceptDeposit">Certify you are accept all policies and deposits:</label>
        <input id="acceptDeposit" type="checkbox"></input>
        <h3>Metamask account connected: {connectedAccount}</h3>
        <StandardButton label="Connect Metamask" className="button-blue" onClick={handleConnectWallet}/>
        <h5>Voting will be finished on .. . ... left</h5>
        <form>
            <div>Select a candidate:</div>
            {candidates && candidates.map((candidate) => 
                <div key={candidate.id}>
                    <input
                        type="radio"
                    >

                    </input>
                </div>
            )}
        </form>
        <StandardButton label="Cast a Vote" className="button-red"/>
        <Contact/>
    </div>
    );
}

export default VotingPage;