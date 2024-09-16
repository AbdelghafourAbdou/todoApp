package App.ToDo.Services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import App.ToDo.DTOs.TagCountDTO;
import App.ToDo.DTOs.TagCreationDTO;
import App.ToDo.Entities.Tag;
import App.ToDo.Entities.Task;
import App.ToDo.Repositories.TagRepository;
import App.ToDo.Repositories.TaskRepository;

@Service
public class TagService {
    @Autowired
    TagRepository tagRepository;

    @Autowired
    TaskRepository taskRepository;

    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    public List<Object> findOrCreateTagforTagCreation(String tagName, String tagColor) {
        String lowerTagName = tagName.toLowerCase();
        List<Object> fctResult = new ArrayList<>();
        Optional<Tag> existingTag = tagRepository.findByName(lowerTagName);
        if (existingTag.isPresent()) {
            fctResult.add(existingTag.get());
            fctResult.add(1);
            return fctResult;
        } else {
            Tag newTag = Tag.builder().name(lowerTagName).color(tagColor).build();
            fctResult.add(tagRepository.save(newTag));
            fctResult.add(0);
            return fctResult;
        }
    }

    public Tag findOrCreateTagforTaskCreation(String tagName, String tagColor) {
        String lowerTagName = tagName.toLowerCase();
        Optional<Tag> existingTag = tagRepository.findByName(lowerTagName);
        if (existingTag.isPresent()) {
            return existingTag.get();
        } else {
            Tag newTag = Tag.builder().name(lowerTagName).color(tagColor).build();
            return tagRepository.save(newTag);
        }
    }

    public List<TagCountDTO> getTagsCounts() {
        List<TagCountDTO> tagsCounts = new ArrayList<TagCountDTO>();
        List<Object[]> results = tagRepository.getTagsCounts();
        for (Object[] result : results) {
            TagCountDTO countDTO = new TagCountDTO((String) result[0], (String) result[1], (Long) result[2]);
            tagsCounts.add(countDTO);
        }
        return tagsCounts;
    }

    public String getTagColor(String tagName) {
        return tagRepository.getTagColor(tagName);
    }

    public List<TagCreationDTO> getShortTags(String taskTags) {
        List<TagCreationDTO> tags = new ArrayList<>();
        String regex = ", ";
        String[] tagsNames = taskTags.split(regex);
        for (String tagName : tagsNames) {
            TagCreationDTO tagCreationDTO = new TagCreationDTO(tagName, getTagColor(tagName));
            tags.add(tagCreationDTO);
        }
        return tags;
    }

    public Task addTagToTask(int taskId, int tagId) {
        Optional<Task> foundTask = taskRepository.findById(Long.valueOf(taskId));
        Optional<Tag> foundTag = tagRepository.findById(Long.valueOf(tagId));

        if (foundTask.isPresent() && foundTag.isPresent()) {
            Task task = foundTask.get();
            Tag tag = foundTag.get();

            taskRepository.createTaskTagConnection(task.getId(), tag.getId());

            return taskRepository.findById(Long.valueOf(taskId)).get();
        } else {
            throw new RuntimeException("Task not found with Id: " + taskId);
        }
    }
}
