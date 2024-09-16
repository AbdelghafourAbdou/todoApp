package App.ToDo.DTOs;

import java.util.ArrayList;
import java.util.List;

import App.ToDo.Entities.Task;
import lombok.Data;

@Data
public class TaskWithoutTags {
    private Task task;
    private List<String> tags;

    public TaskWithoutTags(Task task) {
        this.task = task;
        this.tags = new ArrayList<>();
    }
}
