import './login.css'
import smartIdLogo from '../../assets/Smart-ID_login_btn.png';
import eParakstsLogo from '../../assets/eidas.png';
const Login = () => {
    return(
        <div className='login-main-container'>
            <h3>Connect using ...</h3>
            <div className="login-options">
                <a href='/smartid' className='option-smart-id option'>
                    <img src={smartIdLogo} alt='smartid'></img>
                </a>
                <a href='/eparaksts' className='option-eParaksts option'>
                    <img src={eParakstsLogo} alt='eparaksts'></img>
                </a>
                <a href='/basic' className='option-basic-authorization option'>
                    Basic Authorization
                </a>
                <a href='/inbank' className='option-interenet-banking option'>
                    Internet Banking Authentication
                </a>
            </div>
        </div>
    );
}

export default Login;