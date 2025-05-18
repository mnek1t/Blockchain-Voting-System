import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import Header from "../components/Header/Header";
import Contact from "../components/Contact/Contact";
import ImageUploader from "../components/ImageUploader/ImageUploader";
import '../components/ElectionForm/election-form.css'
import StandardButton from "../components/StandardButton/StandardButton";
import { createElection, SolidityCandidates } from "../api/blockchain/ethers";
import { saveElection } from "../api/offChain/db-api-service"
import { CandidateRequest, DurationUnit } from "../types";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import ReferenceButton from "../components/ReferenceButton/ReferenceButton";
const OrganizeElectionPage = () => {
    const [candidates, setCandidates] = useState<CandidateRequest[]>([{
        id: uuidv4(),
        name: "",
        party: "",
        image: null,
        imagePreview: ""
      }]);
    const unitToSeconds :Record<DurationUnit, number> = {
        'Days': 300,//86400,
        'Weeks': 600,//604800,
        'Months': 1200//2628000
    };
    const [title, setTitle] = useState<string>("");
    const [duration, setDuration] = useState(86400);
    const [revealDuration, setRevealDuration] = useState(86400);

    const [durationMeasurement, setDurationMeasurement] = useState<DurationUnit>('Days');

    const [customDuration, setCustomDuration] = useState(0);

    const [candidateName, setCandidateName] = useState<string>();
    const [candidateParty, setCandidateParty] = useState<string>();

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<'error' | 'success' | 'info' | 'warning'>('error');
    useEffect(() => {
        const draft = localStorage.getItem("electionDraft");
        if (draft) {
            const parsed = JSON.parse(draft);
            setCandidateName(parsed.candidateName || "");
            setCandidateParty(parsed.candidateParty || "");
        }
    }, [])

    function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>, id: string) {
        const { files } = event.target;
        if (files && files[0]) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setCandidates(prev =>
              prev.map(c =>
                c.id === id ? { ...c, image: files[0], imagePreview: reader.result as string } : c
              )
            );
          };
          reader.readAsDataURL(files[0]);
        }
    }

    function handleSaveDraft() {
        console.log(candidates.map(c => c.imagePreview))
        const draft = {
            candidateName,
            candidateParty,
        };
        localStorage.setItem("electionDraft", JSON.stringify(draft));
        alert("Draft saved!");
    }
    
    function handleAddCandidate() {
        if(candidates.length < Number(process.env.REACT_APP_MAX_CANDIDATE_AMOUNT)) {
            setCandidates([...candidates, { id: uuidv4(), name: "", party: "", image: null, imagePreview: ""}]);
        }
    }

    function handleCandidateChange(id: string, field: string, value: string) {
        setCandidates(prev =>
          prev.map(c =>
            c.id === id ? { ...c, [field]: value } : c
          )
        );
    }

    function handleRemoveCandidate(id: string) {
        if(candidates.length > 1) {
            setCandidates(candidates.filter(c => c.id !== id));
        }
    }

    function handleAnnounceElection() {
        if(!title || title === '') {
            setAlertMessage("Provide a title for election.")
            setAlertSeverity('warning');
            return;
        }
        // if (duration < 86400 && customDuration < 0) {
        //     alert("Minimum duration of voring is 1 day!");
        //     return;
        // }
        if(candidates.length < 2) {
            setAlertMessage("Please add at least 2 candidates.")
            setAlertSeverity('warning');
            return;
        }
        if (candidates.some(c => !c.name || !c.party)) {
            setAlertMessage('Please fill out all candidate fields.')
            setAlertSeverity('warning');
            return;
        }
        const candidatesPayload = candidates.map(candidate => ({
            id: candidate.id,
            name: candidate.name,
            party: candidate.party,
            image: candidate.imagePreview
        }));
        const finalDuration = duration === 0 ? customDuration * unitToSeconds[durationMeasurement] : duration;
        console.log('candidatesPayload', candidatesPayload)
        const contractCandidatesInput : SolidityCandidates[] = candidates.map(candidate => ({
            id: candidate.id,
            name: candidate.name,
            voteCount: 0
        }));
        createElection(contractCandidatesInput, 100, process.env.REACT_APP_GOVERNMENT_BUDGET_ADDRESS, 100)
        .then((contractAddress) => {
            console.log(contractAddress)

            saveElection({
                contractAddress: contractAddress, 
                title: title, 
                candidates: candidatesPayload, 
                duration: finalDuration, 
                status: 'active'
            })
            .then((data) => {
                console.log(data);
                setAlertMessage('Election is announced and saved!')
                setAlertSeverity('success');
            })
            .catch((error : any) => {
                setAlertMessage('Error during election save')
                setAlertSeverity('error');
            })
        })
        .catch((error : any) => {
            setAlertMessage(error?.reason)
            setAlertSeverity('error');
        })
    }

    return(
    <div className="app-container">
        <Header/>
        <hr/>
        <h6>This is Admin view with strict access. Please read instructions before starting the election. </h6>
        <ReferenceButton label='To home page' destination="/admin/home"/>
        <br/><br/>
        {alertMessage && <Alert severity={alertSeverity} onClose={() => {setAlertMessage(null)}}>
            <AlertTitle><strong>{alertMessage}</strong></AlertTitle>
            {alertSeverity !== 'success' && 'Please contact support team in case you have some questions!'}
        </Alert>}
        <form className="election-form-container" onSubmit={(e) => {e.preventDefault()}}>
        <div className="election-title">
            <div className="election-form-input">   
                <label htmlFor="election-title-input">Title</label>
                <input id="election-title-input" value={title ? title : ""} onChange={(e) => setTitle(e.target.value)}></input>
            </div>
        </div>
        <div className="election-form-dates">
            <div className="election-form-input">
                <label htmlFor="duration-select">Voting Duration</label>
                <select
                    id="duration-select"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                >
                    <option value={86400}>1 Day</option>
                    <option value={604800}>1 Week</option>
                    <option value={2628000}>1 Month</option>
                    <option value={0}>Custom (enter manually)</option>
                </select>
            </div>
            {
                duration === 0 && 
                <div className="election-custom-duration">
                    <div className="election-form-input">   
                        <label htmlFor="election-custom-duration-input">Unit</label>
                        <input id="election-custom-duration-input" type="number" value={customDuration} onChange={(e) => setCustomDuration(Number(e.target.value))} min={1} max={10} step={1}></input>
                    </div>
                    <div className="election-form-input">
                        <label htmlFor="duration-select">Measurement</label>
                        <select
                            id="duration-select"
                            value={durationMeasurement}
                            onChange={(e) => setDurationMeasurement(e.target.value as DurationUnit)}
                        >
                            <option value={'Days'}>{'Day' + (customDuration === 1 ? '' : 's')}</option>
                            <option value={'Weeks'}>{'Week' + (customDuration === 1 ? '' : 's')}</option>
                            <option value={'Months'}>{'Month' + (customDuration === 1 ? '' : 's')}</option>
                        </select>
                    </div>
                </div> 
            }
            <div className="election-form-input">
                <label htmlFor="reveal-duration-select">Reveal Stage Duration</label>
                <select
                    id="reveal-duration-select"
                    value={revealDuration}
                    onChange={(e) => setRevealDuration(parseInt(e.target.value))}
                >
                    <option value={86400}>1 Day</option>
                    <option value={604800}>1 Week</option>
                </select>
            </div>
        </div>
            {candidates.map((candidate) => (
                    <div className="election-form-candidate" key={candidate.id}>
                        <StandardButton label="X" type="button" onClick={() => handleRemoveCandidate(candidate.id)} disabled={candidates.length === 1}></StandardButton>
                        <ImageUploader
                            handleFileUpload={(e) => handleImageUpload(e, candidate.id)}
                            maxSizeMB="10"
                            accept="image/*"
                            initialImage={candidate.imagePreview || null}
                        />
                        <div className="election-form-input-group">
                        <div className="election-form-input">
                            <label>Name</label>
                            <input value={candidate.name} onChange={(e) => handleCandidateChange(candidate.id, "name", e.target.value)}/>
                        </div>
                        <div className="election-form-input">
                            <label>Party</label>
                            <input value={candidate.party} onChange={(e) => handleCandidateChange(candidate.id, "party", e.target.value)}/>
                        </div>
                        </div>
                    </div>
                ))}
            <div className="election-form-buttons-group">
                <StandardButton label="Add Candidate" className="button-blue" type="button" onClick={handleAddCandidate}></StandardButton>
                <StandardButton label="Save Draft" type="button" onClick={handleSaveDraft} />  
                <StandardButton label="Announce Election" type="submit" className="button-red" onClick={handleAnnounceElection} />    
            </div>
        </form>
        
        <Contact/>
    </div>
    );
}

export default OrganizeElectionPage;