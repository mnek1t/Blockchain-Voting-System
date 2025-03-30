import erafLogo from "../../assets/eraf.png";
import "./contact.css"
import phoneImg from "../../assets/phone-call-svgrepo-com.svg"
import cookiePolicyLogo from "../../assets/user-shield-svgrepo-com.svg"
import termsOfUseLogo from "../../assets/user-pen-svgrepo-com.svg"
import becomeUserLogo from "../../assets/user-plus-svgrepo-com.svg"
import glassesLogo from "../../assets/glasses-svgrepo-com.svg"

import processPersonalDataLogo from "../../assets/user-lock-alt-1-svgrepo-com.svg"

const Contact = () => {
    return(
        <footer className="footer-layout">
            <div><hr/></div>
            <div className="foooter-wrapper">
                <div className="footer-left">
                    <div className="footer-item">
                        <img src={phoneImg} alt="phone"></img>
                        <span>67120000</span>
                    </div>
                    <div className="footer-item">
                        <img src={termsOfUseLogo} alt="phone"></img>
                        <a href="#">Terms of use</a>
                    </div>
                    <div className="footer-item">
                        <img src={processPersonalDataLogo} alt="phone"></img>
                        <a href="#">Processing personal data in the SRS</a>
                    </div>
                    
                    <div className="footer-item">
                        <img src={cookiePolicyLogo} alt="phone"></img>
                        <a href="#">Cookie Use Policy</a>
                    </div>
                    <div className="footer-item">
                        <img src={becomeUserLogo} alt="phone"></img>
                        <a href="#">Become a user</a>
                    </div>
                    <div className="footer-item">
                        <img src={glassesLogo} alt="phone"></img>
                        <a href="#">Accessibility</a>
                    </div>
                </div>
                <div className="footer-right">
                    <div className="footer-left-img-container">
                        <img alt="ERAF" src={erafLogo}></img>
                    </div>
                </div>
            </div>
            <div><hr/></div>

            <div className="bvs-version">
                Version 1.0.0,&nbsp;  
                <a href="http://www.vid.gov.lv" target="_blank" rel="noreferrer">www.vid.gov.lv</a>    
            </div>
        </footer>
    )
}

export default Contact;