import Header from '../components/Header/Header';
import Login from '../components/Login/Login';
import UsefulInformation from '../components/UsefulInformation/UsefulInformation';
import Contact from '../components/Contact/Contact';
const LoginPage = () => {
    return(
        <div className="app-container">
            <Header />
            <hr/>
            <Login/>
            <hr/>
            <UsefulInformation/>
            <Contact />
        </div>
    );
}

export default LoginPage;