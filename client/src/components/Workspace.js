import { useState, useEffect } from 'react';
import Group from './Group';
import Loading from './Loading';
require('dotenv').config();

/**
 * @param {Object} props
 * @param {string} props.token
 * @param {string} props.workspaceId
 * @param {string} props.username
 * @param {Function} props.toHome
 */
export default function Workspace(props) {
    const [workspace, setWorkspace] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [token] = useState(props.token ? props.token : localStorage.getItem('BugTrackerToken'));

    //Fetches the selected workspace and loads it in. If error, displays error
    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.REACT_APP_URL}/user/${props.username}/${props.workspaceId}`, {
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
        .then(res => setWorkspace(res))
        .then(() => setLoading(false))
        .catch(err => props.setError(`(${err.status}): ${err.statusText}`));
    }, [props, token]); 

    const fetchJSON = (object, method) => {
        return fetch(`${process.env.REACT_APP_URL}/user/${props.username}/${props.workspaceId}`, {
            method: method,
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': token
            },
            body: JSON.stringify(object)
        });
    };

    const addItemToGroup = object => {
        object.newItem.creation_date = new Date();
        fetchJSON(object, 'POST')
        .then(res => {
            if (res.status >= 400) {
                throw res;
            }
            return res.json();
        })
        .then(res => setWorkspace(res))
        .catch(err => props.setError(`(${err.status}): ${err.statusText}`));
    };
         
    
    const deleteItem = object => {
        fetchJSON(object, 'DELETE')
        .then(res => {
            if (res.status >= 400) {
                throw res;
            }
            return res.json();
        })
        .then(res => setWorkspace(res))
        .catch(err => props.setError(`(${err.status}): ${err.statusText}`));
    };

    const updateItem = item_id => {
        fetchJSON(item_id, 'PUT')
        .then(res => {
            if (res.status >= 400) {
                throw res;
            }
            return res.json();
        })
        .then(res => setWorkspace(res))
        .catch(err => props.setError(`(${err.status}): ${err.statusText}`));
    };

    if (isLoading) {
        return (
            <Loading />
        )
    } else {
        return (
            <>
            <header id='workspaceHeader'>
                <button id='backButton' className='pure-button' onClick={props.toHome}>Back</button>
                <h1 id='mainTitle'>{workspace.title}</h1>
                <p id='description'>{workspace.description}</p>
            </header>
            <ul>
                {workspace.groups.map(group => <Group key={group._id} addItemToGroup={addItemToGroup} group={group} updateItem={updateItem} deleteItem={deleteItem}/>)}
            </ul>
            </>
        )
    }
}