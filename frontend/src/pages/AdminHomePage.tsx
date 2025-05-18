import Header from "../components/Header/Header";
import Contact from "../components/Contact/Contact";
const AdminHomePage = () => {
    return(
    <div className="app-container">
        <Header/>
        <hr/>
        <h6>This is Admin view with strict access. Please read instructions before starting the election. </h6>
        <div className='login-main-container'>
            <div className="login-options">
                <a href='/election/prep' className='option-smart-id option'>
                    Announce new Election
                </a>
                <a href='/votings' className='option-eParaksts option'>
                    Review elections
                </a>
                <a href='#' className='option-basic-authorization option'>
                    /
                </a>
                <a href='#' className='option-interenet-banking option'>
                    /
                </a>
            </div>
        </div>
        <Contact/>
    </div>
    );
}

export default AdminHomePage;