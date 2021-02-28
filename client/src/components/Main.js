import { useState } from 'react';
import WorkspaceSnippet from './WorkspaceSnippet';
import Workspace from './Workspace';

/**
 * @param {Object} props 
 * @param {Object} props.user
 * @param {string} props.token
 * @param {Function} props.addWorkspace
 * @param {Function} props.deleteWorkspace
 * @param {Function} props.logOut
 */
export default function Main(props) {
    const [workspaceId, setWorkspaceId] = useState('');

    if (workspaceId === '') {
        return (
            <div>
                <header>
                    <button className='pure-button backButton' onClick={props.logOut}>Log out</button>
                    <h1 className='mainTitle'>{props.user.username}'s workspaces</h1>
                </header>
                <ul className='pure-g'>
                    <WorkspaceSnippet default={true} addWorkspace={props.addWorkspace}/>
                    {!props.user.workspaces.length && <p>No workspaces!</p>}
                    {props.user.workspaces.map(workspace => <WorkspaceSnippet key={workspace._id} workspace={workspace} deleteWorkspace={props.deleteWorkspace} setWorkspaceId={setWorkspaceId} />)}
                </ul>
            </div>
        )
    } else {
        return (
            <Workspace token={props.token} workspaceId={workspaceId} username={props.user.username} toHome={() => setWorkspaceId('')}/>
        )
    }
}