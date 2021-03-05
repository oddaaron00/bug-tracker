import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Loading(props) {
    return (
        <div className='loadingContainer'>
            <FontAwesomeIcon className='loadingIcon'icon={faSpinner} size='3x'/>
        </div>
    )
}