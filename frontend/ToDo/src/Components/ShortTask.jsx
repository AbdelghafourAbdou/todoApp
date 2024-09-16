/* eslint-disable react/prop-types */
import { NavLink } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import right from "../Icons/chevron-right.svg";
import { useMutateCheckBox } from '../customHooks';

function ShortTask({ record }) {
    const mutator = useMutateCheckBox(record.id);

    const launchMutation = () => mutator.mutate(record.id);

    return (
        <div key={record.id}>
            <Divider />
            <div className='taskDisplay'>
                <Checkbox style={{ padding: 0 }} checked={record.done ? true : false}
                    onChange={launchMutation} />
                <h4 className='taskDetailsName'>{record.name}</h4>
                <NavLink to={`${record.id}`}><img src={right} alt="Right Icon" className='taskDetailsIcon' /></NavLink>
            </div>
            <Divider />
        </div>
    )
}

export default ShortTask