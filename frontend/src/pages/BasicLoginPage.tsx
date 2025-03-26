import Header from "../components/Header/Header";
import BasicLogin from "../components/BasicLogin/BasicLogin";
const BasicLoginPage = () => {
    return(
    <div className="app-container">
        <Header/>
        <hr/>
        <BasicLogin/>
    </div>
    );
}

export default BasicLoginPage;