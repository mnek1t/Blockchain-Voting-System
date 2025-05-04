import './basicLogin.css'
import StandardButton from '../StandardButton/StandardButton';
import { basicLogin, logout } from '../../api/auth/blockhain-api-service';
import { useState } from 'react';
import { BasicLoginCredentials } from '../../api/auth/blockchain-api-definitions';
import { useNavigate } from 'react-router-dom';
const BasicLogin = () => {
    const navigate = useNavigate();
    const [loginCreds, setLoginCreds] = useState<BasicLoginCredentials>({
        personalNumber: "",
        password: ""
    });

    const handleConnectTo = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(loginCreds)
        basicLogin(loginCreds)
        .then((data) => {
            console.log(data)
            navigate(`/${data.role}/home`)
        })
        .catch((e) => console.error(e))
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
            <a href="/">&lt; To home page</a>
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