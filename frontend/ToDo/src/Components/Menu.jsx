/* eslint-disable react-refresh/only-export-components */
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import future from '../Icons/swap-horizontal.svg';
import tasksList from '../Icons/list-task.svg';
import history from '../Icons/clock-history.svg';
import { tasksQuery, capitalizeFirstLetter } from './Tasks';
import '../App.css';

const tagsQuery = () => ({
    queryKey: ['tags'],
    queryFn: async () => {
        return axios.get(`http://localhost:8080/tagsCounts`)
            .then(response => response.data);
    },
    staleTime: 1000 * 30
})

export const loader = (querClient) =>
    async () => {
        const upcomingTasksQuery = tasksQuery("upcoming");
        const todayTasksQuery = tasksQuery("today");
        const pastTasksQuery = tasksQuery("past");
        const tagsquery = tagsQuery();

        const upcomingTasksCache = querClient.getQueryData(upcomingTasksQuery.queryKey);
        const todayTasksCache = querClient.getQueryData(todayTasksQuery.queryKey);
        const pastTasksCache = querClient.getQueryData(pastTasksQuery.queryKey);
        const tagsCache = querClient.getQueryData(tagsquery.queryKey);
        const mergedTasks = {
            upcomingTasks: upcomingTasksCache, todayTasks: todayTasksCache, pastTasks: pastTasksCache,
            tags: tagsCache
        };

        const upcomingTasksPromise = querClient.fetchQuery(upcomingTasksQuery);
        const todayTasksPromise = querClient.fetchQuery(todayTasksQuery);
        const pastTasksPromise = querClient.fetchQuery(pastTasksQuery);
        const tagsPromise = querClient.fetchQuery(tagsquery);

        return mergedTasks ??
            await Promise.all([upcomingTasksPromise, todayTasksPromise, pastTasksPromise, tagsPromise])
    }

const Menu = () => {
    const { data: upcomingTasks } = useQuery(tasksQuery("upcoming"));
    const { data: todayTasks } = useQuery(tasksQuery("today"));
    const { data: pastTasks } = useQuery(tasksQuery("past"));
    let { data: tags } = useQuery(tagsQuery());
    tags = tags?.sort((a, b) => b.count - a.count);
    return (
        <div className='leftContainer'>
            <h3 className='title'>Menu</h3>
            <div className='tasks'>
                <h4>Tasks</h4>
                <NavLink to='/upcoming' className={({ isActive }) => isActive ? "activeTime" : null}>
                    <div className='taskTime'>
                        <img src={future} alt="Future Tasks Icon" className='taskTimeIcon' />
                        <p className='taskTimeTitle'>Upcoming</p>
                        <p className='taskTimeNumber tasksCount'>{upcomingTasks?.length}</p>
                    </div>
                </NavLink>
                <NavLink to='/today' className={({ isActive }) => isActive ? "activeTime" : null}>
                    <div className='taskTime'>
                        <img src={tasksList} alt="Tasks Icon" className='taskTimeIcon' />
                        <p className='taskTimeTitle'>Today</p>
                        <p className='taskTimeNumber tasksCount'>{todayTasks?.length}</p>
                    </div>
                </NavLink>
                <NavLink to='/past' className={({ isActive }) => isActive ? "activeTime" : null}>
                    <div className='taskTime'>
                        <img src={history} alt="Tasks Icon" className='taskTimeIcon' />
                        <p className='taskTimeTitle'>Past</p>
                        <p className='taskTimeNumber tasksCount'>{pastTasks?.length}</p>
                    </div>
                </NavLink>
            </div>
            <div className='tags'>
                <h4>Tags</h4>
                {tags?.map(tag =>
                    <NavLink key={tag.name} to={`/${tag.name}`} className={({ isActive }) => isActive ? "activeTime" : null}>
                        <div className='tag'>
                            <div className='colorSquare' >
                                <div className='innerColorSquare' style={{ backgroundColor: `${tag.color}` }}></div>
                            </div>
                            <p className='taskTimeTitle'>{capitalizeFirstLetter(tag.name)}</p>
                            <p className='taskTimeNumber tasksCount'>{tag.count}</p>
                        </div>
                    </NavLink>
                )}
            </div>
        </div>
    )
}

export default Menu;