package App.ToDo.Controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

import App.ToDo.DTOs.TagCreationDTO;
import App.ToDo.DTOs.TaskWTags;
import App.ToDo.DTOs.TaskWithoutTags;
import App.ToDo.DTOs.UpdateDTO;
import App.ToDo.Entities.Task;
import App.ToDo.Services.TagService;
import App.ToDo.Services.TaskService;
import jakarta.transaction.Transactional;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@CrossOrigin(origins = { "http://localhost:5173" })
public class TaskController {
    @Autowired
    TaskService taskService;

    @Autowired
    TagService tagService;

    @GetMapping("/tasks")
    public List<Task> getAllTasks() {
        return taskService.getTasks();
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<?> getTask(@PathVariable String taskId) {
        try {
            int taskIdInt = Integer.parseInt(taskId);
            Optional<Task> task = taskService.getTask(taskIdInt);
            String taskTags = taskService.getTaskTags(taskIdInt);
            System.out.println(taskTags);
            if (task.isPresent()) {
                Task taskOnly = task.get();
                if (taskTags == null) {
                    TaskWithoutTags taskWithoutTags = new TaskWithoutTags(taskOnly);
                    return ResponseEntity.ok(taskWithoutTags);
                } else {
                    List<TagCreationDTO> tags = tagService.getShortTags(taskTags);
                    TaskWTags taskWTags = new TaskWTags(taskOnly, tags);
                    return ResponseEntity.ok(taskWTags);
                }
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "Task not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (NumberFormatException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Error parsing task id: " + taskId);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/task")
    public ResponseEntity<?> postTask(@RequestBody Task task) {
        try {
            Task newTask = taskService.createTask(task);
            return ResponseEntity.status(HttpStatus.CREATED).body("Task created successfully: " + newTask);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error Creating task");
        }
    }

    @Transactional
    @PutMapping("/task/{taskId}")
    public ResponseEntity<String> putTask(@PathVariable String taskId, @RequestBody UpdateDTO updateDTO) {
        int taskIdInt = Integer.parseInt(taskId);
        Task updatedTask = taskService.updateTask(taskIdInt, updateDTO);
        return ResponseEntity.status(HttpStatus.OK).body("Task updated successfully: " + updatedTask.toString());
    }

    @Transactional
    @DeleteMapping("/task/{taskId}")
    public ResponseEntity<String> deleteTask(@PathVariable String taskId) {
        int taskIdInt = Integer.parseInt(taskId);
        int affectedRows = taskService.deleteTask(taskIdInt);
        System.out.println("affected rows: " + affectedRows);
        if (affectedRows == 1) {
            return ResponseEntity.status(HttpStatus.OK).body("Task deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task with id: " + taskId + " not found");
    }

    @GetMapping("/tasks/today")
    public ResponseEntity<List<Task>> getTodayTasks() {
        return ResponseEntity.ok(taskService.getTodayTasks());
    }

    @GetMapping("/tasks/upcoming")
    public ResponseEntity<List<Task>> getUpcomingTasks() {
        return ResponseEntity.ok(taskService.getUpcomingTasks());
    }

    @GetMapping("/tasks/past")
    public ResponseEntity<List<Task>> getPastTasks() {
        return ResponseEntity.ok(taskService.getPastTasks());
    }

    @GetMapping("/tasks/{param}")
    public ResponseEntity<List<Task>> getParamTasks(@PathVariable String param) {
        return ResponseEntity.ok(taskService.getParamTasks(param));
    }

    @Transactional
    @PutMapping("/task/status/{taskId}")
    public ResponseEntity<String> putDoneUndone(@PathVariable String taskId) {
        Long longTaskId = Long.parseLong(taskId);
        if (taskService.markUnmarkTask(longTaskId) == 1) {
            return ResponseEntity.status(200).body("Task status inverted");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error changing task status");
    }
}