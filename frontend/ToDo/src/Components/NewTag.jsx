/* eslint-disable react/prop-types */
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useSubmit, useParams } from 'react-router-dom';

function NewTag({ open, setOpen, parentPage = 'Task' }) {
    const submit = useSubmit();
    const queryClient = useQueryClient();
    const tags = queryClient.getQueryData(["tags"]);
    const params = useParams();
    const param = params.param;
    const taskId = params.id;

    const closeDialog = () => { setOpen(false); };

    const submitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        let formDataJson = Object.fromEntries(formData.entries());
        const pattern = new RegExp(`^(${formDataJson.name})`, 'i');
        const tagExists = tags.find(tag => pattern.test(tag.name));

        formDataJson = { ...formDataJson, intent: tagExists ? 'addExistingTag' : 'addNewTag' };

        if (parentPage === 'Task') {
            submit(formDataJson, {
                method: 'POST',
                action: `/${param}/${taskId}`
            })
        } else if (parentPage === 'NewTask' || parentPage === 'EditTask') {
            const { name: tagName, color: tagColor } = formDataJson;
            await axios.post(`http://localhost:8080/tag`, { tagName, tagColor },
                { validateStatus: (status) => status >= 200 && status <= 400 }
            );
            await queryClient.refetchQueries({ queryKey: ["tags"] });
        }
        setOpen(false);
    };

    return (
        <Dialog
            open={open} maxWidth='lg' onClose={closeDialog}
            PaperProps={{
                component: 'form',
                onSubmit: submitForm
            }}>
            <DialogTitle>New Tag</DialogTitle>
            <DialogContent>
                <DialogContentText>Fill the form to create a new tag.</DialogContentText>
                <TextField required margin='dense' id='name' name='name' label='Tag Name' type='text' fullWidth variant='filled' />
                <TextField required margin='dense' id='color' name='color' label='Tag Color' type='color' fullWidth variant='filled' defaultValue="#ffffff" />
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>Cancel</Button>
                <Button type="submit">Create</Button>
            </DialogActions>
        </Dialog>
    )
}

export default NewTag