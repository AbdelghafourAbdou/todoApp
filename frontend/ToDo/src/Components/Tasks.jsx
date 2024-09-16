/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react';
import axios from 'axios';
import { Outlet, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Divider from '@mui/material/Divider';
import plus from '../Icons/plus-lg.svg';
import ShortTask from './ShortTask';
import NewTask from './NewTask';

export const tasksQuery = (param) => ({
    queryKey: ['tasks', param],
    queryFn: async () => {
        return axios.get(`http://localhost:8080/tasks/${param}`)
            .then(response => response.data);
    },
    staleTime: 1000 * 30
})

export const loader = (queryClient) =>
    async ({ params }) => {
        const query = tasksQuery(params.param);

        return (
            queryClient.getQueryData(query.queryKey) ??
            (await queryClient.fetchQuery(query))
        )
    }

export const capitalizeFirstLetter = (word) => ([...word][0].toUpperCase() + [...word].slice(1).join(''))

const Tasks = () => {
    const { param } = useParams();
    const { data } = useQuery(tasksQuery(param));
    let filteredRecords = data.filter(record => record.visible === true);
    filteredRecords = filteredRecords.sort((task1, task2) => task1.id - task2.id);

    const [dialogOpen, setDialogOpen] = useState(false);
    const handleDialogOpen = () => { setDialogOpen(true); };

    return (
        <>
            <div className='middleContainer'>
                <div className='titleContainer'>
                    <h1>{capitalizeFirstLetter(param)}</h1>
                    <h3 className='todayNumber'>{filteredRecords.length}</h3>
                </div>
                <Divider />
                <div className='addTask'>
                    <button className='addTaskButton' onClick={handleDialogOpen}>
                        <img src={plus} alt="Plus Icon" className='plusColor' />
                    </button>
                    <h4 style={{ transform: 'translateX(-0.71em)' }}>Add New Task</h4>
                </div>
                <Divider />
                {filteredRecords.map((record) =>
                    <ShortTask key={record.id} record={record} />
                )}
                <NewTask open={dialogOpen} setOpen={setDialogOpen} />
            </div>
            <Outlet />
        </>
    )
}

export default Tasks;