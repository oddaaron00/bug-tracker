import { useState } from 'react';

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
        due_date: props.item.due_date || '',
        priority: props.item.priority,
        status: props.item.status
    });

    const deleteItem = () => {
        props.deleteItem({
            item_id: props.item._id,
            group_id: props.group_id
        });
    }

    const updateItem = () => {
        //console.log(item.status);
        props.updateItem({
            id: props.item._id,
            item: item
        });
        //console.log(item);
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
        <tr>
            <td className='tooltip'><input type='text' className='item' value={item.title} onChange={e => changeItem({...item, title: e.target.value})} /><span className='tooltiptext'>{item.title}</span></td>
            <td className='tooltip'><input type='text' className='item' value={item.description} onChange={e => changeItem({...item, description: e.target.value})} />{item.description && <span className='tooltiptext'>{item.description}</span>}</td>
            <td>{new Date(item.creation_date).toLocaleString()}</td>
            <td>
            <input type='text' className='item' name='itemDueDate' defaultValue={item.due_date ? new Date(item.due_date).toLocaleString() : ''} onChange={e => {console.log(e.target.value); changeItem({...item, due_date: e.target.value})}}/>
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