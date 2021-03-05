import { useState } from 'react';
import Item from './Item';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare as minusClosed } from '@fortawesome/free-solid-svg-icons';
import { faMinusSquare as minusOpen } from '@fortawesome/free-regular-svg-icons';

/**
 * @param {Object} props
 * @param {string} props.key
 * @param {Function} props.addItemToGroup
 * @param {Object} props.group
 * @param {Function} props.updateItem
 * @param {Function} props.deleteItem
 */
export default function Group(props) {
    const defaultState = {
        group_id: props.group._id,
        newItem: {
            title: '',
            description: '',
            due_date: '',
            priority: '',
            status: ''
        }
    }

    const [dummyRowVisibility, isDummyRowVisible] = useState(false);
    const [buttonVisibility, isButtonVisible] = useState(true);
    const [item, changeItem] = useState(defaultState);
    const [itemVisibility, areItemsVisible] = useState(true);

    const addDummyRow = () => {
        return (
            <div className='newItem'>
                <form className='pure-form' autoComplete='off'>
                    <input type='text' placeholder='Title' name='itemTitle' value={item.newItem.title} onChange={e => changeItem({...item, newItem: {...item.newItem, title: e.target.value}})}/>
                    <input type='text' placeholder='Description' name='itemDescription' value={item.newItem.description} onChange={e => changeItem({...item, newItem: {...item.newItem, description: e.target.value}})}/>
                    <input type='datetime-local' placeholder='Due date' name='itemDueDate' value={item.newItem.due_date} onChange={e => changeItem({...item, newItem: {...item.newItem, due_date: e.target.value}})}/>
                    <select type='text' title='itemPriority' placeholder='Priority' value={item.newItem.priority} onChange={e => changeItem({...item, newItem: {...item.newItem, priority: e.target.value}})}>
                        <option value=''></option>
                        <option value='Low'>Low</option>
                        <option value='Medium'>Medium</option>
                        <option value='High'>High</option>
                    </select>
                    <select type='text' title='itemStatus' className='rightmostNewItem' placeholder='Status' value={item.newItem.status} onChange={e => changeItem({...item, newItem: {...item.newItem, status: e.target.value}})}>
                        <option value=''></option>
                        <option value='Incomplete'>Incomplete</option>
                        <option value='Ordered'>Ordered</option>
                        <option value='Waiting for approval'>Waiting for approval</option>
                        <option value='Complete'>Complete</option>
                    </select>
                    <div className='addNewItemButtons'>
                        <button type='submit' className='pure-button pure-button-primary' aria-label='Add item to group' disabled={item.newItem.title === ''} onClick={e => {
                            e.preventDefault();
                            props.addItemToGroup(item)
                            changeItem(defaultState);
                        }}>ADD</button>
                        <button type='button' className='pure-button' onClick={() => {
                            isDummyRowVisible(false);
                            isButtonVisible(true);
                        }}>BACK</button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <li>
            <div className='groupHeader' onClick={() => areItemsVisible(!itemVisibility)}>
                <FontAwesomeIcon className='collapseGroup' icon={itemVisibility ? minusOpen : minusClosed } aria-label='Minimise group'/>
                <h2 style={{'display':'inline-block'}}>{props.group.title}</h2>
            </div>
            <div className='table-container'>
                <table className='pure-table pure-table-horizontal group'>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Creation date</th>
                            <th>Due date</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>UPDATE</th>
                            <th>DELETE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemVisibility && props.group.items.map(item => <Item key={item._id} item={item} group_id={props.group._id} updateItem={props.updateItem} deleteItem={props.deleteItem}/>)}
                    </tbody>
                </table>
            </div>
            {/*Displays message if no items*/ !props.group.items.length && <p className='noItems'>No items in this group!</p>}
            {dummyRowVisibility && addDummyRow()}
            {buttonVisibility && <button className='pure-button pure-button-primary addItemButton' onClick={() => {
                isDummyRowVisible(true);
                isButtonVisible(false);
            }}>Add Item</button>}
        </li>
    )
}