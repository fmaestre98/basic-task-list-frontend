import React, { useState } from "react";
import TaskModel from "../../models/TaskModel";

export const TaskItem: React.FC<{ task: TaskModel, loadTasks: Function }> = (props) => {
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(props.task.done);
  const [description, setDescription] = useState(props.task.description);

  const changeTaskStatus = (evt: any) => {
    setChecked(evt.target.checked);
    let newDescription = "";
    if (evt.target.checked) {
      newDescription = "<del>" + description + "</del>";
    } else {
      newDescription = description.replace("<del>", "").replace("</del>", "");
    }
    const url = "http://localhost:8080/api/tasks";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "id": props.task.id,
        "user_id": props.task.userId,
        "description": newDescription,
        "done": evt.target.checked
      }),
    }).catch((error) => {
      setError(error.message);
    });

    setDescription(newDescription);
  };

  const deleteTask = (evt: any) => {
    const url = "http://localhost:8080/api/tasks/" + props.task.id;

    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      props.loadTasks();
    }).catch((error) => {
      setError(error.message);
    });

  };

  return (
    <div className="form-check d-flex" id="taskItem">
      <input className="form-check-input" type="checkbox" checked={checked} name={props.task.id.toString()} id={props.task.id.toString()} onChange={changeTaskStatus} />
      <label className="form-check-label" htmlFor={props.task.id.toString()} dangerouslySetInnerHTML={{ __html: description }}></label>
      {error && <div><p className="text-danger">error</p></div>}
    </div>

  );

}