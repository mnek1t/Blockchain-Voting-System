import './elections-view.css';
import { useNavigate } from 'react-router-dom';
import { ElectionResponse } from '../../types';
interface ElectionViewProps {
    elections: ElectionResponse[];
}

const ElectionsView = ({ elections }: ElectionViewProps) => {
    const navigate = useNavigate();

    return (
        <div className="elections-container">
            <h2>All Active Elections</h2>
            <table className="election-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Created By</th>
                    </tr>
                </thead>
                <tbody>
                    {elections && elections.map((election) => (
                        <tr key={election.election_id} onClick={() => navigate(`/voter/vote/${election.election_id}`)}>
                            <td>{election.title}</td>
                            <td>{election.status}</td>
                            <td>{election.created_by}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ElectionsView;
