import './elections-view.css';
import { useNavigate } from 'react-router-dom';
import { ElectionResponse } from '../../types';
import { useTranslation } from 'react-i18next';
interface ElectionViewProps {
    elections: ElectionResponse[];
}

const ElectionsView = ({ elections }: ElectionViewProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="elections-container">
            <h2>{t("allActiveElections")}</h2>
            <table className="election-table">
                <thead>
                    <tr>
                        <th>{t("title")}</th>
                        <th>{t("status")}</th>
                        <th>{t("createdBy")}</th>
                    </tr>
                </thead>
                <tbody>
                    {elections && elections.map((election) => (
                        <tr key={election.election_id} onClick={() => navigate(`/voter/vote/${election.election_id}`)}>
                            <td>{election.title}</td>
                            <td>{t(`electionStatuses.${election.status}`)}</td>
                            <td>{election.created_by}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ElectionsView;
