import { useState } from 'react';
import 'purecss/build/grids-responsive-min.css';

/**
 * 
 * @param {Object} props 
 * @param {foolean} props.default
 * @param {Function} props.addWorkspace
 * @param {Function} props.setWorkspaceId
 * @param {Object} props.workspace
 */
export default function WorkspaceSnippet(props) {
    const [newWorkspace, changeNewWorkspace] = useState({
        title: '',
        description: ''
    });

    const deleteConfirm = () => {
        if (window.confirm('Are you sure you want to delete this workspace?')) {
            props.deleteWorkspace(props.workspace._id)
        }
    }

    //Originally, the 'add workspace' form was going to take the form of a WorkspaceSnippet, hence the 'default' prop denoting said form
    if (props.default) {
        return (
            <li id='addWorkspace' className='pure-form pure-u-1'>
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
                <div className='buttonContainer'>
                    <button className='snippetTitle' onClick={() => props.setWorkspaceId(props.workspace._id)}>{props.workspace.title}</button>
                </div>
                <p>{props.workspace.description}</p>
                <div className='buttonContainer'>
                    <button className='pure-button' onClick={deleteConfirm}>Delete</button>
                </div>
            </div>
        </li>
    )
}