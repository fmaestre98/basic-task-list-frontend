import React, { useRef, useState } from "react";
import ContentEditable from 'react-contenteditable';

export const TaskForm = (props: { newTask: Function }) => {
    const [showForm, setShowForm] = useState(false);
    const [taskDescription, setTaskDescription] = useState("");
    const [error, setError] = useState(null);


    const onContentChange = React.useCallback((evt: any) => {
        const regexHashtag = /#\w+[^\s]+/g;
        const regexMention = /@\w+[^\s]+/g;
        const regexEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b[^\s]+/g;
        const regexLink = /https?:\/\/[^\s]+/g;

        const content = evt.currentTarget.innerHTML;

        const clearContnet = content.replaceAll('</span>', '')
            .replaceAll('<span class="green" style="color: green;">', '')
            .replaceAll('<span class="blue" style="color: blue;">', '')
            .replaceAll('<span class="red" style="color: red;">', '')
            .replaceAll('<span class="purple" style="color: purple;">', '');

        const coloredContent = clearContnet.replace(regexHashtag, '<span class="blue" style="color: blue;">$&</span> ')
            .replace(regexMention, '<span class="green" style="color: green;">$&</span> ')
            .replace(regexEmail, '<span class="red" style="color: red;">$&</span> ')
            .replace(regexLink, '<span class="purple" style="color: purple;">$&</span> ');

        setTaskDescription(coloredContent);
    }, [])



    const handleCancel = () => {
        setTaskDescription("");
        setShowForm(false);
    };

    const keyDown = (evt: any) => {
        if (evt.keyCode == 13) {
            evt.preventDefault()
        }
    };

    const handleAddEvent = () => {
        if (taskDescription.trim().length == 0) {
            setTaskDescription("");
            setShowForm(false);
        } else {

            const url = "http://localhost:8080/api/tasks";

            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "user_id": 1,
                    "description": taskDescription,
                    "done": false
                }),
            })
                .then(() => {
                    props.newTask();
                    setShowForm(false);
                    setTaskDescription("");
                })
                .catch((error) => {
                    setError(error.message);
                });

        }
    };

    if (error) {
        return (
            <div className="container m-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>

        );
    }

    if (!showForm) {
        return (
            <div className="d-flex p-2" onClick={() => setShowForm(true)}>
                <p><i className="bi bi-plus-square text-primary"></i> <small className="text-muted">Type to add new task</small></p>
            </div>
        );
    }

    return (
        <div id="task_form_container">
            <div id="task_description_container">
                <i className="bi bi-plus-square text-primary"></i>
                <ContentEditable
                    onChange={onContentChange}
                    onBlur={onContentChange}
                    html={taskDescription}
                    onKeyDownCapture={keyDown}
                    id="div_content"
                    placeholder={"Type to add new task"}
                />
                <i className="bi bi-person-circle text-primary"></i>
            </div>
            <div>
                <div id="buttons_container" className="d-none d-md-flex">
                    <div id="left_buttons">
                        <button type="button" id="open_button" disabled={taskDescription == "" || taskDescription == "<br>"} className="btn btn-sm"><i className="bi bi-arrows-angle-expand"></i> Open</button>
                        <div id="actions_buttons">
                            <button type="button" disabled={taskDescription == "" || taskDescription == "<br>"} className="btn btn-outline-secondary btn-sm"><i className="bi bi-calendar"></i> Today</button>
                            <button type="button" disabled={taskDescription == "" || taskDescription == "<br>"} className="btn btn-outline-secondary btn-sm"><i className="bi bi-unlock"></i> Public</button>
                            <button type="button" disabled={taskDescription == "" || taskDescription == "<br>"} className="btn btn-outline-secondary btn-sm"><i className="bi bi-brightness-high"></i> Highlight</button>
                            <button type="button" disabled={taskDescription == "" || taskDescription == "<br>"} className="btn btn-outline-secondary btn-sm"><i className="bi bi-0-circle"></i> Estimation</button>
                        </div>
                    </div>

                    <div id="right_buttons" className="d-grid gap-2 d-md-flex">
                        <button type="button" className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
                        <button type="button" className="btn btn-primary btn-sm" onClick={handleAddEvent}>{taskDescription.trim().length > 0 ? "Add" : "Ok"}</button>

                    </div>

                </div>


                <div id="buttons_container" className="d-flex d-md-none">
                    <div id="left_buttons">
                        <button type="button" id="open_button" disabled={taskDescription == "" || taskDescription == "<br>"} className="btn btn-sm"><i className="bi bi-arrows-angle-expand"></i></button>
                        <div id="actions_buttons">
                            <button type="button" disabled={taskDescription == "" || taskDescription == "<br>"} className="btn btn-outline-secondary btn-sm"><i className="bi bi-calendar"></i></button>
                            <button type="button" disabled={taskDescription == "" || taskDescription == "<br>"} className="btn btn-outline-secondary btn-sm"><i className="bi bi-unlock"></i></button>
                            <button type="button" disabled={taskDescription == "" || taskDescription == "<br>"} className="btn btn-outline-secondary btn-sm"><i className="bi bi-brightness-high"></i></button>
                            <button type="button" disabled={taskDescription == "" || taskDescription == "<br>"} className="btn btn-outline-secondary btn-sm"><i className="bi bi-0-circle"></i></button>
                        </div>
                    </div>

                    <div id="right_buttons" className="d-grid gap-2 d-md-flex">
                        <button type="button" className="btn btn-primary btn-sm" onClick={handleAddEvent}>{taskDescription.trim().length > 0 ? <i className="bi bi-plus-lg"></i> : <i className="bi bi-x-lg"></i>}</button>

                    </div>

                </div>
            </div>
        </div>
    );

}