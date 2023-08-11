import React, { useState } from "react";
import TaskModel from "../../models/TaskModel";
import { TaskItem } from "./TaskItem";

export const TaskList: React.FC<{ tasks: TaskModel[] }> = (props) => {

    return (
        <div id="task_list">
            {props.tasks.map(task => (
                <TaskItem task={task} key={task.id} />
            ))}
        </div>
    );


}