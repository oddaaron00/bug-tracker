import 'purecss/build/grids-responsive-min.css';
import { useState } from 'react';
import React = require('react');

type Props = {
    key: string,
    default: boolean,
    setWorkspaceId: Function,
    addWorkspace: Function,
    deleteWorkspace: Function,
    workspace: {
        _id: string,
        owner: string,
        title: string,
        description: string
    }
}

/**
 * 
 * @param {Object} props 
 * @param {boolean} props.default
 * @param {Function} props.addWorkspace
 */
export default function WorkspaceSnippet(props: Props) {
    const [newWorkspace, changeNewWorkspace] = useState({
        title: '',
        description: ''
    });

    const deleteConfirm = () => {
        if (window.confirm('Are you sure you want to delete this workspace?')) {
            props.deleteWorkspace(props.workspace._id)
        }
    }

    if (props.default) {
        return (

            <li className='pure-form pure-u-1 addWorkspace'>
                <fieldset>
                    <legend>Add Workspace</legend>
                    <input type='text' aria-label='New workspace name' name='title' placeholder='Title' value={newWorkspace.title} onChange={e => changeNewWorkspace({...newWorkspace, title: e.target.value})} />
                    <input type='text' id='rightmostFormElement' aria-label='New workspace description' name='description' placeholder='Description' value={newWorkspace.description} onChange={e => changeNewWorkspace({...newWorkspace, description: e.target.value})} />
                    <button className='pure-button pure-button-primary' disabled={newWorkspace.title === ''} onClick={() => {props.addWorkspace(newWorkspace); changeNewWorkspace({title: '', description: ''})}}>CREATE</button>
                </fieldset>
            </li>
        )
    }
    return (
        <li className='pure-u-1 pure-u-md-1-2 pure-u-lg-1-3 snippetContainer'>
            <div className='workspaceSnippet'>
                <h2 onClick={() => props.setWorkspaceId(props.workspace._id)}>{props.workspace.title}</h2>
                <p>{props.workspace.description}</p>
                <div className='buttonContainer'>
                    <button className='pure-button' onClick={deleteConfirm}>Delete</button>
                </div>
            </div>
        </li>
    )
}