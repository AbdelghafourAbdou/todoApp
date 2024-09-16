import Menu from './Menu';
import { Outlet } from 'react-router-dom';
import '../App.css';

export default function Layout() {
    return (
        <div className='outline'>
            <Menu />
            <Outlet />
        </div>
    )
}