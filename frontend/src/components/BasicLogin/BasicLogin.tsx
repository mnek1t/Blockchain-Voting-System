import './basicLogin.css'
import StandardButton from '../StandardButton/StandardButton';
import { basicLogin, logout } from '../../api/auth/blockhain-api-service';
import { useState } from 'react';
import { BasicLoginCredentials } from '../../api/auth/blockchain-api-definitions';
import { useNavigate } from 'react-router-dom';
import ReferenceButton from '../ReferenceButton/ReferenceButton';
import { Alert } from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';
const BasicLogin = () => {
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
            console.error(error)
            setAlertMessage(error.message)
            setAlertSeverity('error')
        })
    }

    const handleForgetPassword = () => {

    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setLoginCreds((prevState) => {
            return {...prevState, [name]: value}
        })
    }

    return(
        <div className='login-main-container'>
            {/* <ReferenceButton label='To Login Options page'/> */}
            <a href="/">&lt; To Login Options page</a>
            {alertMessage && <Alert severity={alertSeverity} onClose={() => {setAlertMessage(null)}}>
                <AlertTitle><strong>{alertMessage}</strong></AlertTitle>
                {alertSeverity !== 'success' && 'Please contact support team in case you have some questions!'}
            </Alert>}
            <h3>Connect To</h3>
            <form className="basic-login-form" onSubmit={(e) => handleConnectTo(e)}>
                <div className='form-input'>
                    <label htmlFor="personalNumber">Personal Number</label>
                    <input id="personalNumber" name="personalNumber" onChange={handleInputChange} autoComplete="off"></input>
                </div>
                <div className='form-input'>
                    <label htmlFor="userPassword">Password</label>
                    <input id="userPassword" type='password' name="password" onChange={handleInputChange} autoComplete='false'></input>
                </div>
                <div className="form-buttons">
                    <StandardButton label='Connect to' className='button-blue' type='submit'/>
                    <StandardButton label='Forget password' onClick={handleForgetPassword}/>
                </div>
            </form>
        </div>
    );
}

export default BasicLogin;