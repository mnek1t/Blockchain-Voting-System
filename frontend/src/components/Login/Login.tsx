import './login.css'
import smartIdLogo from '../../assets/Smart-ID_login_btn.png';
import eParakstsLogo from '../../assets/eidas.png';
const Login = () => {
    return(
        <div className='login-main-container'>
            <h3>Connect using ...</h3>
            <div className="login-options">
                <a href='#' className='option-smart-id'>
                    <img src={smartIdLogo} alt=''></img>
                </a>
                <a href='#' className='option-eParaksts'>
                    <img src={eParakstsLogo} alt=''></img>
                </a>
                <a href='#' className='option-basic-authorization'>
                    Basic Authorization
                </a>
                <a href='#' className='option-interenet-banking'>
                    Internet Banking Authentication
                </a>
            </div>
        </div>
    );
}

export default Login;