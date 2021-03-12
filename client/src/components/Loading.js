import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Loading(props) {
    return (
        <div id='loadingContainer'>
            <FontAwesomeIcon id='loadingIcon' icon={faSpinner} size='3x'/>
        </div>
    )
}