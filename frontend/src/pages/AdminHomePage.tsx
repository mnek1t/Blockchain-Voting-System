import Header from "../components/Header/Header";
import Contact from "../components/Contact/Contact";
import OptionCard from "../components/OptionCard/OptionCard";
import { useTranslation } from "react-i18next";
const AdminHomePage = () => {
    const {t} = useTranslation();
    return(
    <div className="app-container">
        <Header/>
        <hr/>
        <h6>{t("adminMessagePage")}</h6>
        <div className='login-main-container'>
            <div className="login-options">
                <OptionCard href="/election/prep" className='option-smart-id option' label={t("announceElection")}/>
                <OptionCard href="/votings" className='option-eParaksts option' label={t("reviewElections")}/>
            </div>
        </div>
        <Contact/>
    </div>
    );
}

export default AdminHomePage;