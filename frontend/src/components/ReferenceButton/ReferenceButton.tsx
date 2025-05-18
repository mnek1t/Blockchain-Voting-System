import { useNavigate } from "react-router-dom";
import './reference-button.css'
interface ReferenceButtonProps {
    label: string
    destination?: string;
}

const ReferenceButton = ({ label, destination }: ReferenceButtonProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (destination) {
            navigate(destination);
        } else {
            navigate(-1);
        }
    };

    return (
        <button onClick={handleClick} className="reference-button">
            &lt; {label}
        </button>
    );
};

export default ReferenceButton;
