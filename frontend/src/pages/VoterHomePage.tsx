import Header from "../components/Header/Header";
import Contact from "../components/Contact/Contact";
import OptionCard from "../components/OptionCard/OptionCard";
import { useTranslation } from "react-i18next";
const VoterHomePage = () => {
    const { t } = useTranslation();
    return(
    <div className="app-container">
        <Header/>
        <hr/>
        <h6>{t("voterMessagePage")}</h6>
        <div className='login-main-container'>
            <div className="login-options">
                <OptionCard href="/votings" className='option-smart-id option' label="Participate in Voting"/>
                <OptionCard href="/votings" className='option-smart-id option' label="Review previous votings"/>
            </div>
        </div>
        <Contact/>
    </div>
    );
}

export default VoterHomePage;