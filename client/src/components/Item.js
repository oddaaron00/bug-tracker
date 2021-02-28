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
        due_date: props.item.due_date,
        priority: props.item.priority,
        status: props.item.status
    })

    useEffect(() => {
        updateItem()
    }, [])

    const deleteItem = () => {
        props.deleteItem({
            item_id: props.item._id,
            group_id: props.group_id
        })
    }

    const updateItem = () => {
        props.updateItem({
            id: props.item._id,
            item: item
        })
    }

    return (
        <tr>
            <td className='tooltip'><input type='text' className='item' value={item.title} onChange={e => changeItem({...item, title: e.target.value})} /><span className='tooltiptext'>{item.title}</span></td>
            <td className='tooltip'><input type='text' className='item' value={item.description} onChange={e => changeItem({...item, description: e.target.value})} />{item.description && <span className='tooltiptext'>{item.description}</span>}</td>
            <td>{new Date(item.creation_date).toLocaleString()}</td>
            <td><input type='text' className='item' name='itemDueDate' value={item.due_date ? new Date(item.due_date).toLocaleString() : ''} onChange={e => changeItem({...item, due_date: e.target.value})}/></td>
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
            <td><button className='pure-button' onClick={deleteItem}>DELETE</button></td>
        </tr>
    )
}