select * from task_tag INNER JOIN tag ON tag.id = task_tag.tag_id;

SELECT tag.tag_name, COUNT(tag) FROM tag INNER JOIN task_tag ON tag.id = task_tag.tag_id GROUP BY tag.tag_name ;

SELECT COUNT(*) FROM task_tag INNER JOIN tag ON tag.id = task_tag.tag_id WHERE tag."name" = '?' GROUP BY tag."name" ;

SELECT * FROM task_tag;
SELECT task_id, description, done, due_date, name, creation_date, update_date, tag_id, tag_name FROM task ta INNER JOIN task_tag tt ON tt.task_id = ta.id INNER JOIN tag tg ON tg.id = tt.tag_id WHERE ta.visible = true AND ta.id = 26;
SELECT * FROM task ta INNER JOIN task_tag tt ON tt.task_id = ta.id INNER JOIN tag tg ON tg.id = tt.tag_id WHERE ta.visible = true AND ta.id = 26;
SELECT * FROM tag;
SELECT * FROM task;

SELECT task.id, task."name", task.description, task.done, task.visible, task.due_date, task.creation_date, task.update_date 
FROM task INNER JOIN task_tag ON task_tag.task_id = task.id INNER JOIN tag ON tag.id = task_tag.tag_id 
WHERE task.visible = true AND tag.tag_name = 'urgent';

SELECT string_agg(tag_name, ', ') AS concatenated_tags FROM task INNER JOIN task_tag ON task_tag.task_id = task.id INNER JOIN tag ON tag.id = task_tag.tag_id WHERE task.visible = true AND task.id = 45

SELECT tag.tag_name, tag.tag_color, COUNT(tag)
FROM task INNER JOIN task_tag ON task_tag.task_id = task.id INNER JOIN tag ON tag.id = task_tag.tag_id
WHERE task.visible = TRUE
GROUP BY tag.tag_name, tag.tag_color
UNION 
SELECT tag.tag_name, tag.tag_color, CAST(0 AS BIGINT) as count
FROM tag
WHERE tag.tag_name NOT IN (SELECT tag.tag_name
FROM task INNER JOIN task_tag ON task_tag.task_id = task.id INNER JOIN tag ON tag.id = task_tag.tag_id
WHERE task.visible = TRUE
GROUP BY tag.tag_name) 