import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import Contact from "../components/Contact/Contact";
import ImageUploader from "../components/ImageUploader/ImageUploader";
import '../components/ElectionForm/election-form.css'
import StandardButton from "../components/StandardButton/StandardButton";

type Candidate = {
    id: number;
    name: string;
    party: string;
    image: File | null;
    imagePreview: string;
  };

const OrganizeElectionPage = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([{
        id: Date.now(),
        name: "",
        party: "",
        image: null,
        imagePreview: ""
      }]);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [candidateName, setCandidateName] = useState<string>();
    const [candidateParty, setCandidateParty] = useState<string>();

    useEffect(() => {
        const draft = localStorage.getItem("electionDraft");
        if (draft) {
            const parsed = JSON.parse(draft);
            setCandidateName(parsed.candidateName || "");
            setCandidateParty(parsed.candidateParty || "");
            setStartDate(parsed.startDate || "");
            setEndDate(parsed.endDate || "");
        }
    }, [])

    function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>, id: number) {
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
        const draft = {
            candidateName,
            candidateParty,
            startDate,
            endDate
        };
        localStorage.setItem("electionDraft", JSON.stringify(draft));
        alert("Draft saved!");
    }
    
    function handleAddCandidate() {
        if(candidates.length < Number(process.env.REACT_APP_MAX_CANDIDATE_AMOUNT)) {
            setCandidates([...candidates, { id: Date.now(), name: "", party: "", image: null, imagePreview: ""}]);
        }
    }

    function handleCandidateChange(id: number, field: string, value: string) {
        setCandidates(prev =>
          prev.map(c =>
            c.id === id ? { ...c, [field]: value } : c
          )
        );
    }

    function handleRemoveCandidate(id: number) {
        if(candidates.length > 1) {
            setCandidates(candidates.filter(c => c.id !== id));
        }
    }

    function handleAnnounceElection() {
        if (!startDate || !endDate) {
            alert("Please select start and end dates for the election.");
            return;
        }
        if (startDate >= endDate) {
            alert("Start date must be before end date.");
            return;
        }
        if(candidates.length < 2) {
            alert("Please add at least 2 candidates.");
            return;
        }
        if (candidates.some(c => !c.name || !c.party)) {
            alert("Please fill out all candidate fields.");
            return;
        }
        const payload = {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            candidates: candidates.map(({ id, name, party, image }) => ({
              id,
              name,
              party,
              image 
            }))
        };

        console.log("Submitting election:", payload);
        alert("Election submitted!");
    }

    return(
    <div className="app-container">
        <Header/>
        <hr/>
        <h6>This is Admin view with strict access. Please read instructions before starting the election. </h6>
        <form className="election-form-container" onSubmit={(e) => {e.preventDefault()}}>
            <div className="election-form-dates">
                <div className="election-form-input">   
                    <label htmlFor="start-date-input">Start date</label>
                    <input id="start-date-input" type="date" value={startDate ? startDate.toISOString().substring(0, 10) : ""} onChange={(e) => setStartDate(new Date(e.target.value))}></input>
                </div>
                <div className="election-form-input">
                    <label htmlFor="end-date-input">End date</label>
                    <input id="end-date-input" type="date" value={endDate ? endDate.toISOString().substring(0, 10) : ""} onChange={(e) => setEndDate(new Date(e.target.value))}></input>
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