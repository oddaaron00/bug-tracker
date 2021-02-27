import { useState } from 'react';
import './App.css';
import Entry from './components/Entry';
import Main from './components/Main';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function App() {
  const [isLoggedIn, changeLoginState] = useState(false);
  const [user, changeUser] = useState({});
  const [token, setToken] = useState(localStorage.getItem('BugTrackerToken'));
  const [error, setError] = useState();
  
  const logOut = () => {
    localStorage.removeItem('BugTrackerToken');
    setToken('');
    changeUser({});
    changeLoginState(false);
  }

  const addWorkspace = newWorkspace => {
    fetch(`http://localhost:3006/user/${user.username}/`, {
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

const deleteWorkspace = workspaceId => {
  fetch(`http://localhost:3006/user/${user.username}/`, {
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
      <div className='errorContainer' style={{visibility: error ? 'visible' : 'hidden'}}>
                <h2 className='errorMessage'>{error}</h2>
                <FontAwesomeIcon className='errorCross' onClick={() => setError()} icon={faTimes}/>
            </div>
      <Entry changeLoginState={changeLoginState} changeUser={changeUser} setToken={setToken}/>
      </>
    )
  } else {
    return (
      <>
      <div className='errorContainer' style={{visibility: error ? 'visible' : 'hidden'}}>
        <h2 className='errorMessage'>{error}</h2>
        <FontAwesomeIcon className='errorCross' onClick={() => setError()} icon={faTimes}/>
      </div>
      <Main user={user} token={token} addWorkspace={addWorkspace} deleteWorkspace={deleteWorkspace} logOut={logOut}/>
      </>
    )
  }
}