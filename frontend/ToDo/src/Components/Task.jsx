/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react';
import axios from 'axios';
import { useParams, useSubmit } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { redirect } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
//import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { capitalizeFirstLetter } from './Tasks';
import EditTask from './EditTask';
import NewTag from './NewTag';
import plus from '../Icons/plus-lg.svg';
import { isToday } from './NewTask';

export const taskQuery = (queryId) => ({
    queryKey: ['tasks', queryId],
    queryFn: async () => {
        return axios.get(`http://localhost:8080/task/${queryId}`)
            .then(response => response.data);
    },
    staleTime: 1000 * 30
})

export const loader = (queryClient) =>
    async ({ params }) => {
        const query = taskQuery(params.id);

        return (
            queryClient.getQueryData(query.queryKey) ??
            (await queryClient.fetchQuery(query))
        )
    }

export const action = (queryClient) => async ({ request, params }) => {
    const method = request.method;
    const id = params.id;
    if (method == 'DELETE') {
        await axios.delete(`http://localhost:8080/task/${id}`);
        await queryClient.removeQueries({ queryKey: ["tasks", id], exact: true });
        await queryClient.invalidateQueries({ refetchType: 'active' });
        return redirect('..');
    } else if (method == 'POST') {
        const formData = await request.formData();
        const { name: tagName, color: tagColor, intent } = Object.fromEntries(formData.entries());
        const { data: tag } = await axios.post(`http://localhost:8080/tag`, { tagName, tagColor },
            { validateStatus: (status) => status >= 200 && status <= 400 }
        );
        const tagId = tag.id;
        const newTag = { tagName: tag.name, tagColor: tag.color }
        await axios.patch(`http://localhost:8080/task/${id}/tag/${tagId}`);
        queryClient.setQueryData(["tasks", id], (oldTask) => ({ ...oldTask, tags: [...oldTask.tags, newTag] }));
        if (intent == 'addExistingTag') {
            queryClient.setQueryData(["tags"], (oldTags) => {
                const searchedTagIndex = oldTags.findIndex(oldTag => oldTag.name === tag.name);
                let searchedTag = oldTags.find(oldTag => oldTag.name === tag.name);
                searchedTag = { ...searchedTag, count: searchedTag.count + 1 };
                return oldTags.toSpliced(searchedTagIndex, 1, searchedTag);
            });
        } else if (intent == 'addNewTag') {
            queryClient.setQueryData(["tags"], (oldTags) => ([...oldTags, { name: tag.name, color: tag.color, count: 1 }]));
        }
        return null;
    } else if (method === 'PUT') {
        const formData = await request.formData();
        let putBody = Object.fromEntries(formData.entries());
        putBody = { ...putBody, tags: JSON.parse(putBody.tags) };
        let dueDate = putBody.dueDate;
        let param = isToday(dueDate);
        await axios.put(`http://localhost:8080/task/${id}`, putBody);
        await queryClient.invalidateQueries({ refetchType: 'active' });
        return redirect(`/${param}/${id}`);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);

    // Options for formatting the date
    const options = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };

    // Format the date using toLocaleString
    return date.toLocaleString('en-US', options);
}

const Task = () => {
    const params = useParams();
    const taskId = params.id;
    const { data } = useQuery(taskQuery(taskId));
    const task = data.task;
    const tags = data.tags;

    const [editTaskOpen, setEditTaskOpen] = useState(false);
    const handleEditTaskOpen = () => { setEditTaskOpen(true); };

    const [addTagOpen, setAddTagOpen] = useState(false);
    const handleAddTagOpen = () => { setAddTagOpen(true); };

    const submit = useSubmit();

    const deleteTask = () => {
        submit(null, {
            method: 'DELETE',
            action: `/${params.param}/${taskId}`
        })
    }

    return (
        <div className='rightContainer'>
            <h3 className='title'>Task:</h3>
            <div className='rightTaskDetails'>
                <p>{task.name}</p>
                <Divider />
                <p>{task.description}</p>
                <Divider />
                {tags.length > 0 &&
                    <div className='tagsCollection'>Tags: {tags.map(tag => (
                        <p key={tag.tagName} className='tagColor' style={{ backgroundColor: tag.tagColor }}>
                            {capitalizeFirstLetter(tag.tagName)}
                        </p>
                    ))}
                        <Button variant='contained' onClick={handleAddTagOpen}
                            startIcon={<img src={plus} alt="Plus Icon" className="tagPlusColor" />}>Add Tag</Button>
                    </div>
                }
                {tags.length === 0 &&
                    <div className='tagsCollection'>Tags:
                        <Button variant='contained' onClick={handleAddTagOpen}
                            startIcon={<img src={plus} alt="Plus Icon" className="tagPlusColor" />}>Add Tag</Button>
                    </div>
                }
                <p>Creation: {formatDate(task.creationDate)}</p>
                {task.creationDate !== task.updateDate ? <p>Update: {formatDate(task.updateDate)}</p> : null}
                <NewTag open={addTagOpen} setOpen={setAddTagOpen} />
            </div>
            <Stack direction="row" spacing={2} className='rightTaskButtons'>
                <Button variant="outlined" onClick={deleteTask} startIcon={<DeleteIcon />}>Delete Task</Button>
                <Button variant='contained' onClick={handleEditTaskOpen} startIcon={<EditIcon />}>Make Changes</Button>
            </Stack>
            <EditTask open={editTaskOpen} setOpen={setEditTaskOpen} />
        </div>
    )
}

export default Task;