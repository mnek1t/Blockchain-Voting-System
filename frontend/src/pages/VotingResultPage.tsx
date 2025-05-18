import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Contact from '../components/Contact/Contact';
import VotingBarChart from '../components/VoteBarChart/VoteBarChart';
import { ElectionCandidatesResults } from '../types';
import { useEffect, useState } from 'react';
import ReferenceButton from '../components/ReferenceButton/ReferenceButton';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const VotingResultPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const results = location.state?.results as ElectionCandidatesResults[] | undefined;

    useEffect(() => {
        if (!results) {
            navigate("/");
        }
    }, [results, navigate]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="app-container">
            <Header />
            <hr />
            <br />
            <ReferenceButton label='To home page'/>
            <br /><br />
            {isLoading ? (
                <LoadingSpinner innertText="Loading Results..." loading={true} />
            ) : (
                results && <VotingBarChart results={results} />
            )}
            <Contact />
        </div>
    );
};

export default VotingResultPage;
