import { useState } from 'react';
import 'purecss/build/grids-responsive-min.css';

export default function WorkspaceSnippet(props) {
    const [newWorkspace, changeNewWorkspace] = useState({
        title: '',
        description: ''
    });

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
                <button className='pure-button' onClick={() => props.deleteWorkspace(props.workspace._id)}>DELETE</button>
            </div>
        </li>
    )
}