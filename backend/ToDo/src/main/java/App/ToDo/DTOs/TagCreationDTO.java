package App.ToDo.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class TagCreationDTO {
    private String tagName;
    private String tagColor;
}
