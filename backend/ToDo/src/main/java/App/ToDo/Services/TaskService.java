package App.ToDo.Services;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import App.ToDo.DTOs.UpdateDTO;
import App.ToDo.Entities.Tag;
import App.ToDo.Entities.Task;
import App.ToDo.Repositories.TaskRepository;

@Service
public class TaskService {
    @Autowired
    TaskRepository taskRepository;

    @Autowired
    TagService tagService;

    public List<Task> getTasks() {
        return taskRepository.getVisibileTasks();
    }

    public Optional<Task> getTask(int taskId) {
        Long longTaskId = Long.valueOf(taskId);
        try {
            Optional<Task> foundTask = taskRepository.getVisibileTask(longTaskId);
            return foundTask;
        } catch (Exception e) {
            System.out.println("Exception finding task with id: " + taskId + ", error: " + e);
            return Optional.empty();
        }
    }

    public String getTaskTags(int taskId) {
        Long longTaskId = Long.valueOf(taskId);
        return taskRepository.getTaskTags(longTaskId);
    }

    public Task createTask(Task task) {
        Set<Tag> tags = task.getTags().stream()
                .map(tag -> tagService.findOrCreateTagforTaskCreation(tag.getName(), tag.getColor()))
                .collect(Collectors.toSet());
        task.setTags(tags);
        System.out.println(task.getTags());
        try {
            return taskRepository.save(task);
        } catch (Exception e) {
            throw new RuntimeException("Exception saving task: " + e);
        }
    }

    public Task updateTask(int taskId, UpdateDTO newTask) {
        Long longTaskId = Long.valueOf(taskId);
        Optional<Task> foundTask = taskRepository.findById(longTaskId);

        if (foundTask.isPresent()) {
            Task task = foundTask.get();
            task.setName(newTask.getName());
            task.setDescription(newTask.getDescription());
            task.setDone(newTask.getDone());
            task.setDueDate(newTask.getDueDate());
            task.setUpdateDate(newTask.getUpdateDate());

            String taskTagsIds = taskRepository.getTaskTagsIds(longTaskId);
            String[] oldTagsIds = taskTagsIds.split(", ");
            for (String oldTagId : oldTagsIds) {
                System.out.println(oldTagId);
                Long longOldTagId = Long.valueOf(oldTagId);
                taskRepository.deleteTaskTagConnection(longTaskId, longOldTagId);
            }

            Set<Tag> newTags = newTask.getTags();
            for (Tag newTagDTO : newTags) {
                List<Object> searchResult = tagService.findOrCreateTagforTagCreation(
                        newTagDTO.getName(), newTagDTO.getColor());
                Tag newTag = (Tag) searchResult.get(0);
                Long newTagId = newTag.getId();
                System.out.println("Made connection: (" + longTaskId + ", " + newTagId + ")");
                taskRepository.createTaskTagConnection(longTaskId, newTagId);
            }

            return taskRepository.save(task);
        } else {
            throw new RuntimeException("Task not found with Id: " + taskId);
        }
    }

    public int deleteTask(int taskId) {
        Long longTaskId = Long.valueOf(taskId);
        try {
            return taskRepository.hideTask(longTaskId);
        } catch (Exception e) {
            System.out.println("Exception deleting task: " + e);
            return -1;
        }
    }

    public List<Task> getTodayTasks() {
        return taskRepository.getTodayTasks();
    }

    public List<Task> getUpcomingTasks() {
        return taskRepository.getUpcomingTasks();
    }

    public List<Task> getPastTasks() {
        return taskRepository.getPastTasks();
    }

    public List<Task> getParamTasks(String tagName) {
        return taskRepository.getParamTasks(tagName);
    }

    public int markUnmarkTask(Long taskId) {
        return taskRepository.markUnmarkTask(taskId);
    }
}
