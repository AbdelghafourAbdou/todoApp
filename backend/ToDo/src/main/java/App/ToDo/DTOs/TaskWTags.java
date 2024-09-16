package App.ToDo.DTOs;

import java.util.List;

import App.ToDo.Entities.Task;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class TaskWTags {
    private Task task;
    private List<TagCreationDTO> tags;
}
