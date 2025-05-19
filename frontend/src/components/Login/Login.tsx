import './login.css'
import smartIdLogo from '../../assets/Smart-ID_login_btn.png';
import eParakstsLogo from '../../assets/eidas.png';
import OptionCard from '../OptionCard/OptionCard';
import { useTranslation } from "react-i18next";
const Login = () => {
    const {t} = useTranslation();
    return(
        <div className='login-main-container'>
            <h3>{t("connectUsing")}</h3>
            <div className="login-options">
                <a href='/smartid' className='option-smart-id option'>
                    <img src={smartIdLogo} alt='smartid'></img>
                </a>
                <a href='/eparaksts' className='option-eParaksts option'>
                    <img src={eParakstsLogo} alt='eparaksts'></img>
                </a>
                <OptionCard href='/basic' className='option-basic-authorization option' label={t("basicAuth")}/>
                <OptionCard href='/inbank' className='option-interenet-banking option' label={t("internetBanking")}/>
            </div>
        </div>
    );
}

export default Login;