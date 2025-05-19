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
import { useTranslation } from 'react-i18next';

interface VotingViewProps {
    electionId: string,
    candidates: CandidateResponse[],
    contractAddress: string,
    status: string,
    role: string | undefined
    onStatusChange: (newValue: string) => void;
}
const VotingView = ({ electionId, candidates, contractAddress, status, role, onStatusChange}: VotingViewProps) => {
    const { t } = useTranslation();
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
            setAlertMessage(t("warningSelectCandidate"))
            setAlertSeverity('warning');
            return; 
        }
        setModalMode('vote')
        setShowModal(true)
    }
    const handleVoteConfirm = async () => {
        try {
            if(!salt) {
                setAlertMessage(t("please") + t("enterSalt").charAt(0).toLowerCase() + t("enterSalt").slice(1)); 
                setAlertSeverity('success');
                return;
            }
            if(modalMode === 'vote') {
                await vote(contractAddress, selectedCandidate!, salt!)   
                setAlertMessage(t("successVoteSubmitted")); 
                setAlertSeverity('success');
                setModalMode('downloadFile');
                return;
            }
            if(modalMode === 'reveal') {
                await revealVote(contractAddress, selectedCandidate!, salt!)
                
                setAlertMessage(t("successVoteRevealed")); 
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
            setAlertMessage(t("warningSelectCandidate"))
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

            updateElection(contractAddress, 'finished')
                .then(() => onStatusChange('finished'))
                .catch((error) => {setAlertMessage(error?.reason); setAlertSeverity('error'); return;})
            })
        .catch((error : any) => {setAlertMessage(error?.reason); setAlertSeverity('error'); return;})
    }

    const handleOpenReveal = () => {
        endElection(contractAddress)
        .then(() => {
            setAlertMessage(t("sucessOpenRevealPhase")); 
            setAlertSeverity('success');
            updateElection(contractAddress, 'revealing')
                .then(() => onStatusChange('revealing'))
                .catch((error) => {setAlertMessage(error?.reason); setAlertSeverity('error'); return;})
            })
        .catch((error : any) => {setAlertMessage(error?.reason); setAlertSeverity('error'); return;})
    }

    const handleWithdrawToGovernmentBudget = () => {
        withdrawToGovernmentBudget(contractAddress)
        .then(() => {setAlertMessage(t("successWithdrawTransaction")); setAlertSeverity('success');})
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
                            {alertSeverity !== 'success' && t("contactSupport")}
                        </Alert>}
                        <br/>
                        <div><strong>{t("selectCandidate")}</strong></div>
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
                                            <p><strong>{t("party")}:</strong> {candidate.party}</p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <br/>
                    </form>
                    <div className="policy-check-container">
                        <label htmlFor="acceptDeposit" className='policy-label'>{t("policiesAgreement")}</label>
                        <input id="acceptDeposit" className="policy-checkbox" type="checkbox" checked={isPoliciesAccepted} onChange={(e) => setIsPoliciesAccepted(e.target.checked)}></input>
                    </div>
                    <br/>
                    <div className='election-form-buttons-group'>
                        <StandardButton label={t("vote")} className="button-red" onClick={handleCastVote} disabled={!isPoliciesAccepted || statusState  !== 'active'} />
                        <StandardButton label={t("openRevealPhase")} className="button-blue" onClick={handleOpenReveal} disabled={role !== 'admin'}/>
                        <StandardButton label={t("revealVote")} className="button-red" onClick={handleRevealVote} disabled={statusState !== 'revealing'}/>
                        <StandardButton label={t("getResults")} className="button-blue" onClick={handleGetResults} disabled={role !== 'admin'}/>
                        <StandardButton label={t("withdrawToGovernment")} className="button-blue" onClick={handleWithdrawToGovernmentBudget} disabled={role !== 'admin'}/>
                    </div>
                    {showModal && (modalMode === 'vote' || modalMode === 'reveal') ? (
                        <div className="modal">
                            <div className="modal-content">
                            <h3>{t("enterSalt")}</h3>
                            <p>{t("saltDescription")}</p>
                            <div className='election-form-input'>
                                <input
                                type="text"
                                placeholder={t("enterSalt")}
                                value={salt}
                                onChange={(e) => setSalt(e.target.value)}
                                />
                            </div>
                            <br />
                            <div className="election-form-buttons-group">
                                <StandardButton label={t("confirm")}className="button-blue" onClick={handleVoteConfirm}/>
                                <StandardButton label={t("cancel")}  className="button-red" onClick={() => {setShowModal(false); setModalMode(null);}}/>
                            </div>
                            </div>
                        </div>
                        ) : showModal && modalMode === 'downloadFile' ? (
                        <div className="modal">
                            <div className="modal-content">
                            <h3>{t("downloadFileSalt")}</h3>
                            <p>{t("downloadFileSaltDescription")}</p>
                            <br />
                            <div className="election-form-buttons-group">
                                <StandardButton label={t("confirm")} className="button-blue" onClick={() => {downloadSaltFile(salt!); setShowModal(false); setModalMode(null);}}/>
                                <StandardButton label={t("cancel")} className="button-red" onClick={() => {setShowModal(false); setModalMode(null);}}/>
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