import './basicLogin.css'
import StandardButton from '../StandardButton/StandardButton';
import { basicLogin } from '../../api/auth/blockhain-api-service';
import { useState } from 'react';
import { BasicLoginCredentials } from '../../api/auth/blockchain-api-definitions';
import { useNavigate } from 'react-router-dom';
import ReferenceButton from '../ReferenceButton/ReferenceButton';
import { useTranslation } from 'react-i18next';
import CustomAlert from '../CustomAlert/CustomAlert';
const BasicLogin = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<'error' | 'success' | 'info' | 'warning'>('error');
    const [loginCreds, setLoginCreds] = useState<BasicLoginCredentials>({
        personalNumber: "",
        password: ""
    });

    const handleConnectTo = (e: React.FormEvent) => {
        e.preventDefault();
        basicLogin(loginCreds)
        .then((data) => {
            console.log(data)
            navigate(`/${data.role}/home`)
        })
        .catch((error : any) => {
            const errorKey = error.message;
            const translated = t(errorKey.startsWith("error.") ? errorKey : "error.unexpected");
            setAlertMessage(translated);
        })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setLoginCreds((prevState) => {
            return {...prevState, [name]: value}
        })
    }

    const handleForgetPassword = () => {
    }

    return(
        <div className='login-main-container'>
            <div>
                <ReferenceButton label={t('toLoginOptionsPage')}/>
            </div>
            {alertMessage && <CustomAlert alertMessage={alertMessage} alertSeverity={alertSeverity} setAlertMessage={() => setAlertMessage(null)}/>}
            <h3>{t("connectTo")}</h3>
            <form className="basic-login-form" onSubmit={(e) => handleConnectTo(e)}>
                <div className='form-input'>
                    <label htmlFor="personalNumber">{t("personalNumber")}</label>
                    <input id="personalNumber" name="personalNumber" onChange={handleInputChange} autoComplete="off"></input>
                </div>
                <div className='form-input'>
                    <label htmlFor="userPassword">{t("password")}</label>
                    <input id="userPassword" type='password' name="password" onChange={handleInputChange} autoComplete='false'></input>
                </div>
                <div className="form-buttons">
                    <StandardButton label={t("connectTo")} className='button-blue' type='submit'/>
                    <StandardButton label={t("forgetPassword")} onClick={handleForgetPassword}/>
                </div>
            </form>
        </div>
    );
}

export default BasicLogin;