import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

export const useMutateCheckBox = (taskId) => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const param = location.pathname.split('/')[1];

    return useMutation({
        mutationFn: (taskId) => axios.put(`http://localhost:8080/task/status/${taskId}`),
        onSuccess: () => {
            return queryClient.setQueryData(["tasks", param], (oldData) => {
                const staleTask = oldData.find(task => task.id === taskId);
                const staleTaskIndex = oldData.findIndex(task => task.id === taskId);
                const freshTask = { ...staleTask, done: !(staleTask.done) }
                return oldData.toSpliced(staleTaskIndex, 1, freshTask);
            })
        }
    });
}