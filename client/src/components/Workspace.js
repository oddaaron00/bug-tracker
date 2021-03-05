import { useState, useEffect } from 'react';
import Group from './Group';

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

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:3006/user/${props.username}/${props.workspaceId}`, {
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
        return fetch(`http://localhost:3006/user/${props.username}/${props.workspaceId}`, {
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
            <h1>LOADING</h1>
        )
    } else {
        return (
            <>
            <header className='workspaceHeader'>
                <button className='pure-button backButton' onClick={props.toHome}>Back</button>
                <h1 className='mainTitle'>{workspace.title}</h1>
                <p className='description'>{workspace.description}</p>
            </header>
            <ul>
                {workspace.groups.map(group => <Group key={group._id} addItemToGroup={addItemToGroup} group={group} updateItem={updateItem} deleteItem={deleteItem}/>)}
            </ul>
            </>
        )
    }
}