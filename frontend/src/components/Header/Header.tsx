import './header.css';
import logo from '../../assets/logo.png';
import StandardButton from '../StandardButton/StandardButton';
const Header = () => {
    return(
        <nav className="login-header">
            <div className="login-header-col-50">
                <div className='left-padding'>
                    <div className="login-header-logo-holder">
                        <img src={logo} alt="Logo" />
                    </div>
                    <div className="login-header-title-holder">
                        <h1>Blockchain Voting System</h1>
                    </div>
                </div>
            </div>
            <div className="login-header-col-50">
                <div className='right-padding'>
                    <div className="login-header-button-container">
                        <StandardButton label='EN' title="English"/>
                        <StandardButton label='LV' title="Latvian"/>
                    </div>
                </div>
            </div>
            <div className="separator"></div>
        </nav>
    );
}

export default Header;