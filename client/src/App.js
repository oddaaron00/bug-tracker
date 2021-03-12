import { useState } from 'react';
import './styles/App.scss';
import Entry from './components/Entry';
import Main from './components/Main';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
require('dotenv').config();

export default function App() {
  const [isLoggedIn, changeLoginState] = useState(false);
  const [user, changeUser] = useState({});
  const [token, setToken] = useState(localStorage.getItem('BugTrackerToken'));
  const [error, setError] = useState();
  
  /**
   * Removes token from localStorage and logs out user
   */
  const logOut = () => {
    localStorage.removeItem('BugTrackerToken');
    setToken('');
    changeUser({});
    changeLoginState(false);
  }

  /**
   * @param {Object} newWorkspace 
   * @param {string} newWorkspace.title
   * @param {string} newWorkspace.description
   */
  const addWorkspace = newWorkspace => {
    fetch(`${process.env.REACT_APP_URL}/user/${user.username}/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify({newWorkspace, user_id: user._id})
    })
    .then(res => {
        if (res.status !== 200) {
        throw res;
        }
        return res.json();
    })
    .then(res => changeUser(res))
    .catch(err => setError(`(${err.status}): ${err.statusText}`))
}

/**
 * @param {string} workspaceId 
 */
const deleteWorkspace = workspaceId => {
  fetch(`${process.env.REACT_APP_URL}/user/${user.username}/`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify({workspace_id: workspaceId, user_id: user._id})
    })
    .then(res => {
      if (res.status !== 200) {
      throw res;
      }
      return res.json();
  })
  .then(res => changeUser(res))
  .catch(err => setError(`(${err.status}): ${err.statusText}`))
}

  if (!isLoggedIn) {
    return (
      <>
      <div id='errorContainer' style={{visibility: error ? 'visible' : 'hidden'}}>
        <h2 id='errorMessage'>{error}</h2>
        <FontAwesomeIcon id='errorCross' onClick={() => setError()} icon={faTimes}/>
      </div>
      <Entry changeLoginState={changeLoginState} changeUser={changeUser} setToken={setToken} setError={setError}/>
      </>
    )
  } else {
    return (
      <>
      <div id='errorContainer' style={{visibility: error ? 'visible' : 'hidden'}}>
        <h2 id='errorMessage'>{error}</h2>
        <FontAwesomeIcon id='errorCross' onClick={() => setError()} icon={faTimes}/>
      </div>
      <Main user={user} token={token} addWorkspace={addWorkspace} deleteWorkspace={deleteWorkspace} logOut={logOut} setError={setError}/>
      </>
    )
  }
}