import './standardButton.css'
interface StandardButtonProps {
    label: string;
    onClick?: () => void,
    className?: string,
    title?: string,
    type?: "button" | "submit" | "reset"; 
}

const StandardButton = ({ label, onClick, className} : StandardButtonProps) => {
    return(
        <>
            <button className={`standard-button ${className || ''}`} onClick={onClick}>{label}</button>
        </>
    );
}

export default StandardButton;