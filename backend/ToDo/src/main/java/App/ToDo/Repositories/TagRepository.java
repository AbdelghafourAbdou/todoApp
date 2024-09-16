package App.ToDo.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import App.ToDo.Entities.Tag;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);

    @Query(value = "SELECT tag.tag_name, tag.tag_color, COUNT(tag) " +
            "FROM task INNER JOIN task_tag ON task_tag.task_id = task.id INNER JOIN tag ON tag.id = task_tag.tag_id " +
            "WHERE task.visible = TRUE " +
            "GROUP BY tag.tag_name, tag.tag_color " +
            "UNION " +
            "SELECT tag.tag_name, tag.tag_color, CAST(0 AS BIGINT) as count " +
            "FROM tag " +
            "WHERE tag.tag_name NOT IN (SELECT tag.tag_name " +
            "FROM task INNER JOIN task_tag ON task_tag.task_id = task.id INNER JOIN tag ON tag.id = task_tag.tag_id " +
            "WHERE task.visible = TRUE " +
            "GROUP BY tag.tag_name) ", nativeQuery = true)
    public List<Object[]> getTagsCounts();

    @Query("SELECT t.color FROM Tag t WHERE t.name = :tagName")
    public String getTagColor(@Param("tagName") String tagName);
}
