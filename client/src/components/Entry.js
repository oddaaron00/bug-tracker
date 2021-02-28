import { useEffect, useState } from 'react';
import Login from './Login';
import Register from './Register';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

/**
 * @param {Object} props
 * @param {Function} props.changeLoginState
 * @param {Function} props.changeUser
 * @param {Function} props.setToken
 */
export default function Entry(props) {
    const [isLogin, isRegister] = useState(true);
    const [error, setError] = useState();

    /**
     * If a token exists, calls getUser with said token
     */
    useEffect(() => {
        const token = localStorage.getItem('BugTrackerToken');
        if (token) {
            getUser(token);
        }
    }, [])

    /**
     * Attempts to register user with provided info
     * @param {String} username - Supplied username
     * @param {String} password - Supplied password
     */
    const attemptRegister = (username, password) => {
        fetch('http://localhost:3006/register', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username,
            password: password
          })
        })
        .then(res => {
            if (res.status !== 200) {
              throw res;
            }
            return res.json();
        })
        .then(res => {
            setError();
            if (res.token !== null) {
                props.setToken(res.token)
                getUser(res.token)
            }
        })
        .catch(err => setError(`(${err.status}): ${err.statusText}`));
    }

    /**
     * Attempts to login user with provided info
     * @param {String} username - Supplied username
     * @param {String} password - Supplied password
     */
    const attemptLogin = (username, password) => {
        fetch('http://localhost:3006/login', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(res => {
            if (res.status !== 200) {
            throw res;
            }
            return res.json();
        })
        .then(res => {
            setError();
            if (res.token !== null) {
                props.setToken(res.token);
                getUser(res.token);
            }
        })
        .catch(err => setError(`(${err.status}): ${err.statusText}`))
    }

    /**
     * Gets user from server
     * @param {String} token - JWT for user
     */
    const getUser = token => {
        fetch('http://localhost:3006/user', {
            method: 'GET',
            headers: {
                'x-access-token': token
            }
        })
        .then(res => {
            if (res.status !== 200) {
                throw res;
            }
            return res.json();
        })
        .then(res => {
            props.changeUser(res);
            props.changeLoginState(true);
            localStorage.setItem('BugTrackerToken', token);
        })
        .catch(err => setError(`(${err.status}): ${err.statusText}`))
    }

    if (isLogin) {
        return (
            <>
            <div className='errorContainer' style={{visibility: error ? 'visible' : 'hidden'}}>
                <h2 className='errorMessage'>{error}</h2>
                <FontAwesomeIcon className='errorCross' onClick={() => setError()} icon={faTimes}/>
            </div>
            <Login changeToRegister={() => {setError(); isRegister(false)}} attemptLogin={attemptLogin} />
            </>
        )
    } else {
        return (
            <>
            <div className='errorContainer' style={{visibility: error ? 'visible' : 'hidden'}}>
                <h2 className='errorMessage'>{error}</h2>
                <FontAwesomeIcon className='errorCross' onClick={() => setError()} icon={faTimes}/>
            </div>
            <Register changeToLogin={() => {setError(); isRegister(true)}} attemptRegister={attemptRegister} />
            </>
        )
    }
}