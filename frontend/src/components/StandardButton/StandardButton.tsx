import './standardButton.css'
interface StandardButtonProps {
    label: string;
    onClick?: () => void,
    className?: string,
    title?: string,
    type?: "button" | "submit" | "reset"; 
    disabled?: boolean;
}

const StandardButton = ({ label, onClick, className, disabled} : StandardButtonProps) => {
    return(
        <>
            <button className={`standard-button ${className || ''} ${disabled ? 'disabled' : ''}`} onClick={onClick} disabled={disabled}>{label}</button>
        </>
    );
}

export default StandardButton;