import { useState, useEffect } from 'react';

/**
 * @param {Object} props
 * @param {string} props.key
 * @param {Object} props.item
 * @param {string} props.group_id
 * @param {Function} props.updateItem
 * @param {Function} props.deleteItem
 */
export default function Item(props) {

    const [item, changeItem] = useState({
        title: props.item.title,
        description: props.item.description,
        creation_date: props.item.creation_date,
        due_date: props.item.due_date ? new Date(props.item.due_date).toLocaleString('en-US') : '',
        priority: props.item.priority,
        status: props.item.status
    });

    const [isLate, setLateness] = useState(props.item.due_date && new Date(props.item.due_date) < Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            if (props.item.due_date && new Date(props.item.due_date) < Date.now()) {
                setLateness(true);
            } else {
                setLateness(false);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [props.item.due_date])

    const deleteItem = () => {
        props.deleteItem({
            item_id: props.item._id,
            group_id: props.group_id
        });
    }

    const updateItem = () => {
        props.updateItem({
            id: props.item._id,
            item: item
        });
    }

    const checkItemEquality = () => {
        if (item.title === '') {
            return true;
        //isNaN(new Date('').getTime()) returns true so this checks that item.due_date is a valid date and is not empty
        } else if (isNaN(new Date(item.due_date).getTime()) && item.due_date !== '') {
            return true;
        } else {
            return item.title === props.item.title
            && item.description === props.item.description
            && item.creation_date === props.item.creation_date
            //Checks that either both due_dates are not empty and equal or are empty and equal
            && (new Date(item.due_date).getTime() === new Date(props.item.due_date).getTime() || (item.due_date === (props.item.due_date == null ? '' : props.item.due_date)))
            && item.priority === props.item.priority
            && item.status === props.item.status;
        }
    }

    return (
        <tr className={props.item.status === 'Complete' ? props.item.status : (isLate ? 'Late' : 'NotLate')}>
            <td className='tooltip'><input type='text' className='item' value={item.title} onChange={e => changeItem({...item, title: e.target.value})} /><span className='tooltiptext'>{item.title}</span></td>
            <td className='tooltip'><input type='text' className='item' value={item.description} onChange={e => changeItem({...item, description: e.target.value})} />{item.description && <span className='tooltiptext'>{item.description}</span>}</td>
            <td>{new Date(item.creation_date).toLocaleString('en-US')}</td>
            <td>
            <input type='text' className='item' name='itemDueDate' value={item.due_date} onChange={e => changeItem({...item, due_date: e.target.value})}/>
            </td>
            <td>
                <select type='text' className='item' title='priority' value={item.priority} onChange={e => changeItem({...item, priority: e.target.value})}>
                    <option value=''></option>
                    <option value='Low'>Low</option>
                    <option value='Medium'>Medium</option>
                    <option value='High'>High</option>
                </select>
            </td>
            <td>
                <select type='text' className='item' title='status' value={item.status} onChange={e => changeItem({...item, status: e.target.value})}>
                    <option value=''></option>
                    <option value='Incomplete'>Incomplete</option>
                    <option value='Ordered'>Ordered</option>
                    <option value='Waiting for approval'>Waiting for approval</option>
                    <option value='Complete'>Complete</option>
                </select>
            </td>
            <td><button className='pure-button' disabled={checkItemEquality()} onClick={updateItem}>Update</button></td>
            <td><button className='pure-button' onClick={deleteItem}>Delete</button></td>
        </tr>
    )
}