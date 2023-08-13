import { useEffect, useState } from "react";
import TaskModel from "../models/TaskModel";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";

export const TaskApp = () => {

    const [tasks, setTasks] = useState<TaskModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTasks();

    }, []);

    const fetchTasks = async () => {
        const baseUrl = "http://localhost:8080/api/tasks";

        const url = baseUrl + "?page=0&size=9&sort=id,desc";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        const responseJson = await response.json();

        const data = responseJson._embedded.tasks;

        const loadedTasks: TaskModel[] = [];
        for (const item in data) {
            loadedTasks.push({
                id: data[item].id,
                userId: data[item].userId,
                description: data[item].description,
                done: data[item].done
            });
        }

        setTasks(loadedTasks);
        setIsLoading(false);

    };

    const loadTasks = () => {
        fetchTasks().catch((error: any) => {
            setIsLoading(false);
            setError(error.message);
        });
    }

    if (isLoading) {
        return (
            <div className="container m-5 d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container m-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>

        );
    }

    return (
        <div className="container" data-testid="app">
            <TaskForm newTask={loadTasks} />
            <TaskList tasks={tasks} />
        </div>
    );

}