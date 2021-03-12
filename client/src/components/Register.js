import { useState } from 'react';

/**
 * @param {Object} props 
 * @param {Function} props.changeToLogin
 * @param {Function} props.attemptRegister
 */
export default function Register(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div id='entry'>
            <div id='container'>
                <h1>Register</h1>
                <form className='pure-form pure-form-stacked'>
                    <label htmlFor='username'>Username</label>
                    <input type='text' placeholder='Username' id='username' name='username' autoComplete="username" value={username} onChange={e => setUsername(e.target.value)}/>
                    <label htmlFor='password'>Password</label>
                    <input type='password' placeholder='Password' id='password' name='password' autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)}/>
                    <button className='pure-button pure-button-primary' id='enter' disabled={username === '' || password === ''} onClick={e => {e.preventDefault(); props.attemptRegister(username, password)}}>Register</button>
                </form>
                <button className='pure-button' id='switch' onClick={props.changeToLogin}>Already a user? Login</button>
            </div>
        </div>
    )
}