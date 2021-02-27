import { useState } from 'react';

export default function Register(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div id='entry'>
            <div className='container'>
                <h1>Register</h1>
                <form className='pure-form pure-form-stacked'>
                    <label htmlFor='username'>Username</label>
                    <input type='text' placeholder='Username' id='username' name='username' value={username} onChange={e => setUsername(e.target.value)}/>
                    <label htmlFor='password'>Password</label>
                    <input type='password' placeholder='Password' id='password' name='password' value={password} onChange={e => setPassword(e.target.value)}/>
                    <button className='pure-button pure-button-primary' id='enter' disabled={username === '' || password === ''} onClick={e => {e.preventDefault(); props.attemptRegister(username, password)}}>Register</button>
                </form>
                <button className='pure-button' id='switch' onClick={props.changeToLogin}>Already a user? Login</button>
            </div>
        </div>
    )
}