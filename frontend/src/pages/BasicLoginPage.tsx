import Header from "../components/Header/Header";
import BasicLogin from "../components/BasicLogin/BasicLogin";
import Contact from "../components/Contact/Contact";
const BasicLoginPage = () => {
    return(
    <div className="app-container">
        <Header/>
        <hr/>
        <BasicLogin/>
        <Contact/>
    </div>
    );
}

export default BasicLoginPage;