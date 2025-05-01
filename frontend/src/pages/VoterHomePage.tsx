import Header from "../components/Header/Header";
import Contact from "../components/Contact/Contact";
import OptionCard from "../components/OptionCard/OptionCard";
const VoterHomePage = () => {
    return(
    <div className="app-container">
        <Header/>
        <hr/>
        <h6>This is Voter view. Please read instructions before voting</h6>
        <div className='login-main-container'>
            <div className="login-options">
                <OptionCard href="/voter/voting" className='option-smart-id option' label="Participate in Voting"/>
                <OptionCard href="#" className='option-smart-id option' label="Review previous votings"/>
            </div>
        </div>
        <Contact/>
    </div>
    );
}

export default VoterHomePage;