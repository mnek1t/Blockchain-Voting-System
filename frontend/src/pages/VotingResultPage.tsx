
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Contact from '../components/Contact/Contact';
import VotingBarChart from '../components/VoteBarChart/VoteBarChart';
import { ElectionCandidatesResults } from '../types';
import { useEffect } from 'react';
const VotingResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const results = location.state?.results as ElectionCandidatesResults[];
    useEffect(() => {
        if(!results) {
            navigate("/")
        }
    }, [results])
    return(
        <div className="app-container">
            <Header />
            <hr/>
            <br/>
            <button
                onClick={() => navigate(-1)}
                style={{ fontFamily:"sans-serif", fontSize: '15px',background: 'none', border: 'none', color: '#012169', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
            >
                &lt; To home page
            </button>
            <br/><br/>
            {results ? <VotingBarChart results={results} /> : <p>Loading...</p>}
            <Contact />
        </div>
    );
}

export default VotingResultPage;