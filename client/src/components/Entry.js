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

    /**
     * If a token exists on component mount, calls getUser with said token
     */
    useEffect(() => {
        const token = localStorage.getItem('BugTrackerToken');
        if (token) {
            getUser(token);
        }
    }, [])

    /**
     * Attempts to register user with provided info
     * @param {string} username - Supplied username
     * @param {string} password - Supplied password
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
            if (res.status >= 400) {
              throw res;
            }
            return res.json();
        })
        .then(res => {
            props.setError();
            if (res.token !== null) {
                props.setToken(res.token)
                getUser(res.token)
            }
        })
        .catch(err => props.setError(`(${err.status}): ${err.statusText}`));
    }

    /**
     * Attempts to login user with provided info
     * @param {string} username - Supplied username
     * @param {string} password - Supplied password
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
            if (res.status >= 400) {
            throw res;
            }
            return res.json();
        })
        .then(res => {
            props.setError();
            if (res.token !== null) {
                props.setToken(res.token);
                getUser(res.token);
            }
        })
        .catch(err => props.setError(`(${err.status}): ${err.statusText}`))
    }

    /**
     * Gets user from server
     * @param {string} token - JWT for user
     */
    const getUser = token => {
        fetch('http://localhost:3006/user', {
            method: 'GET',
            headers: {
                'x-access-token': token
            }
        })
        .then(res => {
            if (res.status >= 400) {
                throw res;
            }
            return res.json();
        })
        .then(res => {
            props.changeUser(res);
            props.changeLoginState(true);
            localStorage.setItem('BugTrackerToken', token);
        })
        .catch(err => props.setError(`(${err.status}): ${err.statusText}`))
    }

    if (isLogin) {
        return (
            <Login changeToRegister={() => {props.setError(); isRegister(false)}} attemptLogin={attemptLogin} />
        )
    } else {
        return (
            <Register changeToLogin={() => {props.setError(); isRegister(true)}} attemptRegister={attemptRegister} />
        )
    }
}