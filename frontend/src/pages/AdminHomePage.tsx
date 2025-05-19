import Header from "../components/Header/Header";
import Contact from "../components/Contact/Contact";
import OptionCard from "../components/OptionCard/OptionCard";
const AdminHomePage = () => {
    return(
    <div className="app-container">
        <Header/>
        <hr/>
        <h6>This is Admin view with strict access. Please read instructions before starting the election. </h6>
        <div className='login-main-container'>
            <div className="login-options">
                <OptionCard href="/election/prep" className='option-smart-id option' label="Announce new Election"/>
                <OptionCard href="/votings" className='option-eParaksts option' label="Review elections"/>
            </div>
        </div>
        <Contact/>
    </div>
    );
}

export default AdminHomePage;