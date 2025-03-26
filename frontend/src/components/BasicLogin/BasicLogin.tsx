import './basicLogin.css'
const BasicLogin = () => {
    return(
        <div className='login-main-container'>
            <a href="/"> &lt; To home Page</a>
            <h2>Connect To</h2>
            <form className="basic-login-form">
                <div className='form-input'>
                    <label htmlFor="username">Username</label>
                    <input id="username"></input>
                </div>
                <div className='form-input'>
                    <label htmlFor="userPassword">Password</label>
                    <input id="userPassword" type='password'></input>
                </div>
                <div className="form-buttons">
                    <button className='button-blue'>Connect to</button>
                    <button>Forget password</button>
                </div>
            </form>
        </div>
    );
}

export default BasicLogin;