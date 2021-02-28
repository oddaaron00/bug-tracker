import { useState } from 'react';

/**
 * @param {Object} props 
 * @param {Function} props.changeToRegister
 * @param {Function} props.attemptLogin
 */
export default function Login(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div id='entry'>
            <div className='container'>
                <h1>Login</h1>
                <form className='pure-form pure-form-stacked'>
                    <label htmlFor='username'>Username</label>
                    <input type='text' placeholder='Username' name='username' id='username' value={username} onChange={e => setUsername(e.target.value)}/>
                    <label htmlFor='password'>Password</label>
                    <input type='password' placeholder='Password' name='password' id='password' value={password} onChange={e => setPassword(e.target.value)}/>
                    <button className='pure-button pure-button-primary' id='enter' onClick={e => {e.preventDefault(); props.attemptLogin(username, password)}}>Login</button>
                </form>
                <button className='pure-button' id='switch' onClick={props.changeToRegister}>Not a user? Register</button>
            </div>
        </div>
    )
}