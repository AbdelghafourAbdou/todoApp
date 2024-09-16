/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useSubmit, useParams } from 'react-router-dom';
import { Autocomplete, Checkbox, Chip } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { capitalizeFirstLetter } from './Tasks';
import NewTag from './NewTag';
import plus from '../Icons/plus-lg.svg';

function EditTask({ open, setOpen }) {
    const [tagCreationOpen, setTagCreationOpen] = useState(false);
    const submit = useSubmit();
    const { param, id: taskId } = useParams();
    const queryClient = useQueryClient();
    let tags = queryClient.getQueryData(["tags"]);
    tags = [...tags, { name: 'New Tag' }]
    let { task, tags: taskTags } = queryClient.getQueryData(["tasks", taskId]);
    taskTags = taskTags.map(taskTag => ({ name: taskTag.tagName, color: taskTag.tagColor }));
    const [selectedTags, setSelectedTags] = useState(taskTags);

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
        formDataJson = { ...formDataJson, done: task.done, tags: JSON.stringify(selectedTags) };
        setOpen(false);
        submit(formDataJson, {
            method: 'PUT',
            action: `/${param}/${taskId}`
        })
    };

    return (
        <>
            <Dialog
                open={open} maxWidth='lg' onClose={closeDialog}
                PaperProps={{
                    component: 'form',
                    onSubmit: submitForm
                }}>
                <DialogTitle>Update Task</DialogTitle>
                <DialogContent>
                    <DialogContentText>Fill the form to update your task.</DialogContentText>
                    <TextField required margin='dense' id='name' name='name' label='Task Name' type='text' fullWidth variant='filled'
                        defaultValue={task.name} />
                    <TextField required margin='dense' id='description' name='description' label='Task Description'
                        type='text' fullWidth variant='filled' multiline rows={3} defaultValue={task.description} />
                    <TextField required margin='dense' id='dueDate' name='dueDate' label='Due Date' type='date' fullWidth
                        variant='filled' defaultValue={task.dueDate} />
                    <Autocomplete multiple id='tags' options={tags} disableCloseOnSelect
                        onChange={onAutoCompleteChange}
                        defaultValue={taskTags}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
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
                    <Button type="submit">Update</Button>
                </DialogActions>
            </Dialog>
            {<NewTag open={tagCreationOpen} setOpen={setTagCreationOpen} parentPage='EditTask' />}

        </>
    )
}

export default EditTask;