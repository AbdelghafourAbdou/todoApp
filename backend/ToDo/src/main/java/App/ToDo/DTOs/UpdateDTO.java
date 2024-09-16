package App.ToDo.DTOs;

import App.ToDo.Entities.Tag;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

import lombok.Data;

@Data
public class UpdateDTO implements Serializable{
    public String name;
    public String description;
    public Boolean done;
    public Set<Tag> tags;
    public LocalDate dueDate;
    public Date updateDate;

    public UpdateDTO(String name, String description, Boolean done, Set<Tag> tags, LocalDate dueDate){
        this.name = name;
        this.description = description;
        this.done = done;
        this.tags = tags;
        this.dueDate = dueDate;
        this.updateDate = new Date();
    }
}
