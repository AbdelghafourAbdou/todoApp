/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useSubmit, useLocation, redirect } from 'react-router-dom';
import { Autocomplete, Checkbox } from '@mui/material';
import Chip from '@mui/material/Chip';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { capitalizeFirstLetter } from './Tasks';
import { taskQuery } from './Task';
import plus from '../Icons/plus-lg.svg';
import NewTag from './NewTag';

export const action = (queryClient) => async ({ request }) => {
    const formData = await request.formData();
    let newTaskBody = Object.fromEntries(formData);
    delete newTaskBody.additionalIntent;
    newTaskBody = { ...newTaskBody, tags: JSON.parse(newTaskBody.tags) };
    const route = isToday(newTaskBody.dueDate);
    const data = await axios.post('http://localhost:8080/task', newTaskBody);
    const regex = /id=(\d+)/i;
    const id = data.data.match(regex)[1];
    await queryClient.prefetchQuery(taskQuery(id));
    await queryClient.invalidateQueries({ refetchType: 'active' });
    return redirect(`/${route}/${id}`);
}

export const isToday = (dateString) => {
    const inputDate = new Date(dateString);
    const today = new Date();

    if (inputDate.getDate() === today.getDate() &&
        inputDate.getMonth() === today.getMonth() &&
        inputDate.getFullYear() === today.getFullYear()) {
        return 'today';
    } else if (
        inputDate.getFullYear() > today.getFullYear() ||
        inputDate.getFullYear() === today.getFullYear() && inputDate.getMonth() > today.getMonth() ||
        inputDate.getFullYear() === today.getFullYear() && inputDate.getMonth() === today.getMonth()
        && inputDate.getDate() > today.getDate()) {
        return 'upcoming';
    } else return 'past';
}

function NewTask({ open, setOpen }) {
    const [tagCreationOpen, setTagCreationOpen] = useState(false);
    const submit = useSubmit();
    const queryClient = useQueryClient();
    let tags = queryClient.getQueryData(["tags"]);
    tags = [...tags, { name: 'New Tag' }]
    const [selectedTags, setSelectedTags] = useState([]);
    const location = useLocation();
    const param = location.pathname.split('/')[1];

    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayDate = `${now.getFullYear()}-${month}-${day}`;

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const closeDialog = () => { setOpen(false); };
    const onAutoCompleteChange = (_, tags) => {
        if (tags.find((tag) => tag.name === 'New Tag')) {
            tags.pop();
            setTagCreationOpen(true);
        } else {
            setSelectedTags(tags.map(tag => ({ name: tag.name, color: tag.color })));
        }
    }

    const submitForm = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        let formDataJson = Object.fromEntries(formData.entries());
        formDataJson = {
            ...formDataJson, done: false, visible: true, tags: JSON.stringify(selectedTags),
            intent: 'createTask'
        };
        setOpen(false);
        submit(formDataJson, {
            method: 'POST',
            action: `/${param}`
        });
    };

    return (
        <>
            <Dialog
                open={open} maxWidth='lg' onClose={closeDialog}
                PaperProps={{
                    component: 'form',
                    onSubmit: submitForm
                }}>
                <DialogTitle>New Task</DialogTitle>
                <DialogContent>
                    <DialogContentText>Fill the form to create a new task.</DialogContentText>
                    <TextField required margin='dense' id='name' name='name' label='Task Name' type='text' fullWidth variant='filled' />
                    <TextField required margin='dense' id='description' name='description' label='Task Description'
                        type='text' fullWidth variant='filled' multiline rows={3} />
                    <TextField required margin='dense' id='dueDate' name='dueDate' label='Due Date' type='date' fullWidth
                        variant='filled' defaultValue={todayDate} min={todayDate} />
                    <Autocomplete multiple id='tags' options={tags} disableCloseOnSelect
                        onChange={onAutoCompleteChange}
                        getOptionLabel={(tag) => (tag.name)}
                        renderOption={(props, tag, { selected }) => {
                            const { key, ...optionProps } = props;
                            return (
                                <>
                                    {tag.name !== 'New Tag' &&
                                        <li key={key} {...optionProps}>
                                            <Checkbox icon={icon} checkedIcon={checkedIcon}
                                                style={{ marginRight: 8 }} checked={selected} />
                                            {capitalizeFirstLetter(tag.name)}
                                        </li>
                                    }
                                    {tag.name === 'New Tag' &&
                                        <li key={key} {...optionProps}>
                                            <img src={plus} alt="Tag Creation Button"
                                                style={{ marginRight: '1.20em', marginLeft: '0.7em' }} />
                                            {capitalizeFirstLetter(tag.name)}
                                        </li>
                                    }
                                </>
                            );
                        }}
                        style={{ width: '100%' }}
                        renderTags={(selectedTags, getTagProps) =>
                            selectedTags.map((tag, index) => (
                                <Chip key={tag.name} label={capitalizeFirstLetter(tag.name)}
                                    {...getTagProps({ index })} />
                            ))}
                        renderInput={(params) => (
                            <TextField margin='dense' variant='filled' {...params} label="Tags" placeholder='Tag' helperText="Please select associated tags" />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    <Button type="submit">Post</Button>
                </DialogActions>
            </Dialog>
            {<NewTag open={tagCreationOpen} setOpen={setTagCreationOpen} parentPage='NewTask' />}
        </>
    )
}

export default NewTask