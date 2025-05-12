import './voting-view.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CandidateResponse, ElectionCandidatesResults } from '../../types';
import StandardButton from '../StandardButton/StandardButton';
import { vote, revealVote, endElection, getResults, getVotingTimestamps,getDepositAmount, getGovernmentAddress, hasAddressVoted, withdrawToGovernmentBudget, hasAddressRevealed} from '../../api/blockchain/votingService';
import { updateElection } from '../../api/offChain/db-api-service';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import VotingBarChart from '../VoteBarChart/VoteBarChart';
interface VotingViewProps {
    electionId: string,
    candidates: CandidateResponse[],
    contractAddress: string,
    status: string,
    role: string | undefined
}
const VotingView = ({ electionId, candidates, contractAddress, status, role}: VotingViewProps) => {
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<'error' | 'success' | 'info' | 'warning'>('error');
    const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
    const [isPoliciesAccepted, setIsPoliciesAccepted] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'vote' | 'reveal' | null>(null);
    const [salt, setSalt] = useState<string>();
    const [votingResults, setVotingResults] = useState<ElectionCandidatesResults[]>([])
    const handleCastVote = () => {
        if(!selectedCandidate) {
            setAlertMessage('Please select your candidate!')
            setAlertSeverity('warning');
            return; 
        }
        setModalMode('vote')
        setShowModal(true)
    }
    const handleVoteConfirm = async () => {
        try {
            if(!salt) {
                alert('Please enter your salt');
                return;
            }
            if(modalMode === 'vote') {
                await vote(contractAddress, selectedCandidate!, salt!)   
                setAlertMessage("Vote is submitted!"); 
                setAlertSeverity('success');
            }
            if(modalMode === 'reveal') {
                await revealVote(contractAddress, selectedCandidate!, salt!)
                
                setAlertMessage("Vote is revealed!"); 
                setAlertSeverity('success');   
            }
            setShowModal(false);
            setModalMode(null)
            setSelectedCandidate(null);
            setSalt('');
            setIsPoliciesAccepted(false); 
        } catch (error: any) {
            setAlertMessage(error?.reason)
            setAlertSeverity('error')
            setShowModal(false);
            setModalMode(null)
            setSelectedCandidate(null);
            setSalt('');
            setIsPoliciesAccepted(false);
        }
    }

    const handleRevealVote = () => {
        if(!selectedCandidate) {
            setAlertMessage('Please select your candidate that you voted')
            setAlertSeverity('warning');
            return; 
        }
        setModalMode('reveal')
        setShowModal(true)
    }
    
    const handleGetResults = () => {
        // setVotingResults()
        const data = [{id: "1", name: "mykyta", voteCount:10}, {id: "2", name: "andrii", voteCount:5}, {id: "2", name: "andrii", voteCount:5}, {id: "2", name: "andrii", voteCount:5}, {id: "2", name: "andrii", voteCount:5}]
        console.log(votingResults)
        navigate(`/voter/vote/${electionId}/results`, {state: {results: data}})
        getResults(contractAddress)
        .then(data => {setVotingResults(data); setVotingResults([{id: "1", name: "mykyta", voteCount:10}, {id: "2", name: "andrii", voteCount:5}])})
        .catch((error : any) => {setAlertMessage(error?.reason); setAlertSeverity('error'); return;})
        // updateElection(contractAddress, 'finished')
        // .then((data) => console.log(data))
        // .catch((data) => console.log(data))
    }

    const handleOpenReveal = () => {
        endElection(contractAddress)
        .then(() => {setAlertMessage("Election is set to Revealing stage!"); setAlertSeverity('success');})
        .catch((error : any) => {setAlertMessage(error?.reason); setAlertSeverity('error'); return;})
        
        updateElection(contractAddress, 'revealing')
        .then((data) => console.log(data))
        .catch((data) => console.log(data))
    }

    const handleGetVotingTimestamps = () => {
        hasAddressRevealed(contractAddress)
        .then((result) => {
            console.log(result)
        })
        .catch()
        // getVotingTimestamps(contractAddress)
        // .then((result) => {
        //     console.log(result)
        //     const startTime = result._startTime
        //     const endTime = result._endTime
        //     const revealEndTime = result._revealEndTime
        //     console.log(startTime)
        //     console.log(endTime)
        //     console.log(revealEndTime)

        //     const now = Math.floor(Date.now() / 1000);
        //     if (now < endTime) {
        //         console.log("Voting phase ongoing. Time left:", endTime - now, "seconds");
        //       } else if (now < revealEndTime) {
        //         console.log("Reveal phase ongoing. Time left:", revealEndTime - now, "seconds");
        //       } else {
        //         console.log("Voting and reveal phases are over.");
        //       }
        // })
        // .catch(err => {console.error(err)})
    }

    const handleWithdrawToGovernmentBudget = () => {
        withdrawToGovernmentBudget(contractAddress)
        .then(data => {setAlertMessage("Transaction successfull! Please check government account."); setAlertSeverity('success');})
        .catch((error : any) => {setAlertMessage(error?.reason); setAlertSeverity('error');})
    }
    
    return (
        <>
            {votingResults.length > 0 ? 
                (<VotingBarChart results={votingResults}></VotingBarChart>) 
                :  
                (<>
                    <form>
                        {alertMessage && <Alert severity={alertSeverity} onClose={() => {setAlertMessage(null)}}>
                            <AlertTitle><strong>{alertMessage}</strong></AlertTitle>
                            {alertSeverity !== 'success' && 'Please contact support team in case you have some questions!'}
                        </Alert>}
                        <br/>
                        <div><strong>Select a candidate:</strong></div>
                        <div className="candidate-list">
                            {candidates?.map((candidate) => (
                                <label className="candidate-card" key={candidate.candidate_id}>
                                    <input
                                        type="radio"
                                        name="candidate"
                                        value={candidate.candidate_id}
                                        className="candidate-radio"
                                        onChange={() => setSelectedCandidate(candidate.candidate_id)}
                                    />
                                    <div className="candidate-info">
                                        {candidate.image && (
                                            <img
                                                src={`data:${candidate.image.type};base64,${btoa(String.fromCharCode(...candidate.image.data))}`}
                                                alt={candidate.name}
                                                className="candidate-image"
                                            />
                                        )}
                                        <div>
                                            <h3>{candidate.name}</h3>
                                            <p><strong>Party:</strong> {candidate.party}</p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <br/>
                    </form>
                    <div className="policy-check-container">
                        <label htmlFor="acceptDeposit" className='policy-label'>I certify that I accept all policies and deposit conditions.</label>
                        <input id="acceptDeposit" className="policy-checkbox" type="checkbox" checked={isPoliciesAccepted} onChange={(e) => setIsPoliciesAccepted(e.target.checked)}></input>
                    </div>
                    <br/>
                    <div className='election-form-buttons-group'>
                        <StandardButton label="Cast a Vote" className="button-red" onClick={handleCastVote} disabled={!isPoliciesAccepted || status !== 'active'} />
                        <StandardButton label="Open Reveal Phase" className="button-blue" onClick={handleOpenReveal} disabled={role !== 'admin'}/>
                        <StandardButton label="Reveal a Vote" className="button-red" onClick={handleRevealVote} disabled={false}/>
                        <StandardButton label="Get Results" className="button-blue" onClick={handleGetResults} disabled={role !== 'admin'}/>
                        <StandardButton label="Withdraw to Government budget" className="button-blue" onClick={handleWithdrawToGovernmentBudget} disabled={role !== 'admin'}/>

                        {/* TODO: DELETE */}
                        <StandardButton label="getVotingTimestamps" className="button-blue" onClick={handleGetVotingTimestamps} disabled={role !== 'admin'}/>
                    </div>
                    {showModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <h3>Enter Salt</h3>
                                <p>This salt ensures privacy. Save it securely — it’s required to reveal your vote later.</p>
                                <div className='election-form-input'>
                                    <input
                                        type="text"
                                        placeholder="Enter your salt"
                                        value={salt}
                                        onChange={(e) => setSalt(e.target.value)}
                                    />
                                </div>
                                <br />
                                <div className="election-form-buttons-group">
                                    <StandardButton label="Confirm Vote" className="button-blue" onClick={handleVoteConfirm}/>
                                    <StandardButton label="Cancel" className="button-red" onClick={() => setShowModal(false)}/>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default VotingView;