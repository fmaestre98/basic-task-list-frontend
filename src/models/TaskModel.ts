class TaskModel {
    id: number;
    userId: number;
    description: string;
    done: boolean;

    constructor(id: number, userId: number, description: string, done: boolean,) {
        this.id = id;
        this.userId = userId;
        this.description = description;
        this.done = done;
    }

}

export default TaskModel;