package App.ToDo.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import App.ToDo.DTOs.TagCountDTO;
import App.ToDo.DTOs.TagCreationDTO;
import App.ToDo.Entities.Tag;
import App.ToDo.Entities.Task;
import App.ToDo.Services.TagService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class TagController {
    @Autowired
    TagService tagService;

    @GetMapping("/tags")
    public List<Tag> getTags() {
        return tagService.getAllTags();
    }

    @GetMapping("/tagsCounts")
    public List<TagCountDTO> getTagsCounts() {
        return tagService.getTagsCounts();
    }

    @PostMapping("/tag")
    public ResponseEntity<?> postTag(@RequestBody TagCreationDTO tag) {
        try {
            List<Object> searchResult = tagService.findOrCreateTagforTagCreation(tag.getTagName(), tag.getTagColor());
            Tag newTag = (Tag) searchResult.get(0);
            int searchVerdict = (int) searchResult.get(1);
            if (searchVerdict == 1) {
                return ResponseEntity.status(HttpStatus.FOUND).body(newTag);
            } else {
                return ResponseEntity.status(HttpStatus.CREATED).body(newTag);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating tag");
        }
    }

    @PatchMapping("/task/{taskId}/tag/{tagId}")
    public ResponseEntity<?> addTagToTask(@PathVariable String taskId, @PathVariable String tagId) {
        int taskIdInt = Integer.parseInt(taskId);
        int tagIdInt = Integer.parseInt(tagId);
        Task updatedTask = tagService.addTagToTask(taskIdInt, tagIdInt);
        return ResponseEntity.status(HttpStatus.OK).body("Task updated successfully: " + updatedTask.toString());
    }
}
