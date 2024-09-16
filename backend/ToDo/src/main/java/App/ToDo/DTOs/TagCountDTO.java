package App.ToDo.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class TagCountDTO {
    private String name;
    private String color;
    private Long count;
}
