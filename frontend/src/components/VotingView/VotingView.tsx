import './voting-view.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CandidateResponse, ElectionCandidatesResults } from '../../types';
import StandardButton from '../StandardButton/StandardButton';
import { vote, revealVote, endElection, getResults, withdrawToGovernmentBudget} from '../../api/blockchain/votingService';
import { updateElection } from '../../api/offChain/db-api-service';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import VotingBarChart from '../VoteBarChart/VoteBarChart';
import { downloadSaltFile } from '../../utils/utils';
interface VotingViewProps {
    electionId: string,
    candidates: CandidateResponse[],
    contractAddress: string,
    status: string,
    role: string | undefined
    onStatusChange: (newValue: string) => void;
}
const VotingView = ({ electionId, candidates, contractAddress, status, role, onStatusChange}: VotingViewProps) => {
    const navigate = useNavigate();
    const [statusState, setStatusState] = useState(status);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<'error' | 'success' | 'info' | 'warning'>('error');
    const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
    const [isPoliciesAccepted, setIsPoliciesAccepted] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'vote' | 'reveal' | 'downloadFile' | null>(null);
    const [salt, setSalt] = useState<string>();
    const [votingResults, setVotingResults] = useState<ElectionCandidatesResults[]>([])
    useEffect(() => {
        setStatusState(status)
    }, [status])
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
                setModalMode('downloadFile');
                return;
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
        getResults(contractAddress)
        .then(data => {
            const updatedResults = data.map((result: any) => ({
                id: result[0],
                name: result[1],
                voteCount: Number(result[2]),
              }));
            console.log(updatedResults)
            setVotingResults(updatedResults)
            navigate(`/voter/vote/${electionId}/results`, {state: {results: updatedResults}})
        })
        .catch((error : any) => {setAlertMessage(error?.reason); setAlertSeverity('error'); return;})
        
        updateElection(contractAddress, 'finished')
        .then((data) => onStatusChange('finished'))
        .catch((data) => console.log(data))
    }

    const handleOpenReveal = () => {
        endElection(contractAddress)
        .then(() => {setAlertMessage("Election is set to Revealing stage!"); setAlertSeverity('success');})
        .catch((error : any) => {setAlertMessage(error?.reason); setAlertSeverity('error'); return;})
        
        updateElection(contractAddress, 'revealing')
        .then((data) => onStatusChange('revealing'))
        .catch((data) => console.log(data))
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
                                        checked={selectedCandidate === candidate.candidate_id}
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
                        <StandardButton label="Cast a Vote" className="button-red" onClick={handleCastVote} disabled={!isPoliciesAccepted || statusState  !== 'active'} />
                        <StandardButton label="Open Reveal Phase" className="button-blue" onClick={handleOpenReveal} disabled={role !== 'admin'}/>
                        <StandardButton label="Reveal a Vote" className="button-red" onClick={handleRevealVote} disabled={statusState !== 'revealing'}/>
                        <StandardButton label="Get Results" className="button-blue" onClick={handleGetResults} disabled={role !== 'admin'}/>
                        <StandardButton label="Withdraw to Government budget" className="button-blue" onClick={handleWithdrawToGovernmentBudget} disabled={role !== 'admin'}/>
                    </div>
                    {showModal && (modalMode === 'vote' || modalMode === 'reveal') ? (
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
                                <StandardButton label="Cancel" className="button-red" onClick={() => {setShowModal(false); setModalMode(null);}}/>
                            </div>
                            </div>
                        </div>
                        ) : showModal && modalMode === 'downloadFile' ? (
                        <div className="modal">
                            <div className="modal-content">
                            <h3>Download File with Salt</h3>
                            <p>Do you want to download your salt file for safekeeping?</p>
                            <br />
                            <div className="election-form-buttons-group">
                                <StandardButton label="Download" className="button-blue" onClick={() => {downloadSaltFile(salt!); setShowModal(false); setModalMode(null);}}/>
                                <StandardButton label="Cancel" className="button-red" onClick={() => {setShowModal(false); setModalMode(null);}}/>
                            </div>
                            </div>
                        </div>
                        ) : null}
                </>
            )}
        </>
    );
};

export default VotingView;