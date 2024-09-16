package App.ToDo.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import App.ToDo.Entities.Task;
import jakarta.transaction.Transactional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Modifying
    @Query(value = "Update task SET visible = false WHERE id = :id", nativeQuery = true)
    public int hideTask(@Param("id") Long id);

    @Modifying
    @Query(value = "Update task SET done = NOT done WHERE id = :id", nativeQuery = true)
    public int markUnmarkTask(@Param("id") Long id);

    @Query(value = "SELECT * FROM task WHERE visible = true", nativeQuery = true)
    public List<Task> getVisibileTasks();

    @Query(value = "SELECT * FROM task WHERE visible = true AND id = :id", nativeQuery = true)
    public Optional<Task> getVisibileTask(@Param("id") Long id);

    @Query(value = "SELECT string_agg(tag_name, ', ') AS concatenated_tags FROM task INNER JOIN task_tag ON task_tag.task_id = task.id INNER JOIN tag ON tag.id = task_tag.tag_id WHERE task.visible = true AND task.id = :id", nativeQuery = true)
    public String getTaskTags(@Param("id") Long id);

    @Query(value = "SELECT string_agg(CAST(tag.id AS VARCHAR), ', ') AS concatenated_tags FROM task INNER JOIN task_tag ON task_tag.task_id = task.id INNER JOIN tag ON tag.id = task_tag.tag_id WHERE task.visible = true AND task.id = :id", nativeQuery = true)
    public String getTaskTagsIds(@Param("id") Long id);

    @Query(value = "SELECT * FROM task WHERE visible = true AND due_date = CURRENT_DATE", nativeQuery = true)
    public List<Task> getTodayTasks();

    @Query(value = "SELECT * FROM task WHERE visible = true AND due_date > CURRENT_DATE", nativeQuery = true)
    public List<Task> getUpcomingTasks();

    @Query(value = "SELECT * FROM task WHERE visible = true AND due_date < CURRENT_DATE", nativeQuery = true)
    public List<Task> getPastTasks();

    @Query(value = "SELECT task.id, task.name, task.description, task.done, task.visible, task.due_date, task.creation_date, task.update_date FROM task INNER JOIN task_tag ON task_tag.task_id = task.id INNER JOIN tag ON tag.id = task_tag.tag_id WHERE task.visible = true AND tag.tag_name = :tagName", nativeQuery = true)
    public List<Task> getParamTasks(@Param("tagName") String tagName);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM task_tag WHERE task_id = :taskId AND tag_id = :tagId", nativeQuery = true)
    public void deleteTaskTagConnection(@Param("taskId") Long taskId, @Param("tagId") Long tagId);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO task_tag (task_id, tag_id) VALUES (:taskId, :tagId)", nativeQuery = true)
    public void createTaskTagConnection(@Param("taskId") Long taskId, @Param("tagId") Long tagId);
}