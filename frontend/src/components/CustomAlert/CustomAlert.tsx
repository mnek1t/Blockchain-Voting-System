import { Alert, AlertTitle } from "@mui/material";
import { useTranslation } from "react-i18next";
interface CustomAlertProps {
    alertMessage: string | null;
    setAlertMessage: (message: string | null) => void;
    alertSeverity: 'error' | 'success' | 'info' | 'warning';
}

const CustomAlert = ({alertMessage, alertSeverity, setAlertMessage}: CustomAlertProps) => {
    const {t} = useTranslation();
    return(
        <Alert severity={alertSeverity} onClose={() => {setAlertMessage(null)}}>
            <AlertTitle><strong>{alertMessage}</strong></AlertTitle>
            {alertSeverity !== 'success' && t('contactSupport')}
        </Alert>
    )
}
export default CustomAlert;