import './voting-view.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CandidateResponse } from '../../types';
import StandardButton from '../StandardButton/StandardButton';
import { vote } from '../../api/blockchain/votingService';
interface VotingViewProps {
    candidates: CandidateResponse[],
    contractAddress: string
}
const VotingView = ({ candidates, contractAddress }: VotingViewProps) => {
    const navigate = useNavigate();
    const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
    const [isPoliciesAccepted, setIsPoliciesAccepted] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [salt, setSalt] = useState<string>();
    const handleCastVote = () => {
        if(!selectedCandidate) {
            alert('Please select a candidate')
            return; 
        }
        setShowModal(true)
    }
    const handleVoteConfirm = async () => {
        try {
            if(!salt) {
                alert('Please enter your salt');
                return;
            }
            
            await vote(contractAddress, selectedCandidate!, salt!)
            alert("Vote is submitted!")
            setShowModal(false);
            setSelectedCandidate(null);
            setSalt('');
            setIsPoliciesAccepted(false); 
        } catch (error) {
            console.error(error)
        }
    }
    
    return (
        <>
            <form>
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
            <StandardButton label="Cast a Vote" className="button-red" onClick={handleCastVote} disabled={!isPoliciesAccepted}/>
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
    );
};

export default VotingView;