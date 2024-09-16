package App.ToDo.Entities;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Tag {
    @Id
    @SequenceGenerator(name = "tagId", sequenceName = "tagSequence", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tagId")
    private Long id;

    @Column(name = "tag_name")
    private String name;

    @Column(name = "tag_color")
    private String color;

    @ManyToMany(mappedBy = "tags")
    @Builder.Default
    private Set<Task> tasks = new HashSet<>();
}
