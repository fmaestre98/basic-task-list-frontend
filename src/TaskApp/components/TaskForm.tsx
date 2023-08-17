import React, { useState } from "react";
import sanitizeHtml from 'sanitize-html';
import ContentEditable from 'react-contenteditable';

export const TaskForm = (props: { newTask: Function }) => {
    const [showForm, setShowForm] = useState(false);
    const [taskDescription, setTaskDescription] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    const onContentChange = React.useCallback((evt: any) => {
        const regexHashtag = /#\w+[^\s]+/g;
        const regexMention = /(^|\s)@(\w+[^\s]+)/g;
        const regexEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,}[^\s]+/g;
        const regexLink = /https?:\/\/[^\s]+/g;

        const content = " " + evt.currentTarget.innerHTML;

        const clearContnet = content.replaceAll('</span>', '')
            .replaceAll('<span class="green text-success">', '')
            .replaceAll('<span class="blue text-primary">', '')
            .replaceAll('<span class="red text-danger">', '')
            .replaceAll('<span class="purple text-warning">', '');
        const coloredContent = clearContnet.replace(regexHashtag, '<span class="blue text-primary">$&</span>')
            .replace(regexMention, ' <span class="green text-success">$&</span>')
            .replace(regexEmail, '<span class="red text-danger">$&</span>')
            .replace(regexLink, '<span class="purple text-warning">$&</span>');


        setTaskDescription(sanitizeHtml(coloredContent, {
            allowedAttributes: {
                'span': ['class']
            }
        }));
    }, [])



    const handleCancel = () => {
        setTaskDescription("");
        setShowForm(false);
    };

    const keyDown = (evt: any) => {
        if (evt.keyCode === 13) {
            evt.preventDefault()
        }
    };

    const invalidDescription = () => {
        return taskDescription === "" || taskDescription === "<br>" || taskDescription.trim() === "" || taskDescription === "<br />";

    };

    const handleAddEvent = () => {
        if (invalidDescription()) {
            setTaskDescription("");
            setShowForm(false);
        } else {
            setIsLoading(true);
            const url = "https://basic-task-list.onrender.com/api/tasks";

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
                    setIsLoading(false);
                })
                .catch((error) => {
                    setIsLoading(false);
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
            <div className="d-flex p-2" onClick={() => setShowForm(true)} data-testid="new_task" id="new_task">
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
                    data-testid="div_content_editable"
                />
                <i className="bi bi-person-circle text-primary"></i>
            </div>
            <div>
                <div id="buttons_container" className="d-none d-md-flex">
                    <div id="left_buttons" data-testid="actions_buttons">
                        <button type="button" id="open_button" disabled={invalidDescription()} className="btn btn-sm"><i className="bi bi-arrows-angle-expand"></i> Open</button>
                        <div id="actions_buttons">
                            <button type="button" disabled={invalidDescription()} className="btn btn-outline-secondary btn-sm"><i className="bi bi-calendar"></i> Today</button>
                            <button type="button" disabled={invalidDescription()} className="btn btn-outline-secondary btn-sm"><i className="bi bi-unlock"></i> Public</button>
                            <button type="button" disabled={invalidDescription()} className="btn btn-outline-secondary btn-sm"><i className="bi bi-brightness-high"></i> Highlight</button>
                            <button type="button" disabled={invalidDescription()} className="btn btn-outline-secondary btn-sm"><i className="bi bi-0-circle"></i> Estimation</button>
                        </div>
                    </div>

                    <div id="right_buttons" className="d-grid gap-2 d-md-flex">
                        <button id="cancel_button" type="button" className="btn btn-sm" onClick={handleCancel} >Cancel</button>
                        <button type="button" disabled={isLoading} className="btn btn-primary btn-sm" onClick={handleAddEvent} data-testid="ok_button" id="ok_button">
                            {isLoading ?
                                <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                : invalidDescription() ? "Ok" : "Add"}
                        </button>

                    </div>

                </div>


                <div id="buttons_container" className="d-flex d-md-none">
                    <div id="left_buttons">
                        <button type="button" id="open_button" disabled={invalidDescription()} className="btn btn-sm"><i className="bi bi-arrows-angle-expand"></i></button>
                        <div id="actions_buttons">
                            <button type="button" disabled={invalidDescription()} className="btn btn-outline-secondary btn-sm"><i className="bi bi-calendar"></i></button>
                            <button type="button" disabled={invalidDescription()} className="btn btn-outline-secondary btn-sm"><i className="bi bi-unlock"></i></button>
                            <button type="button" disabled={invalidDescription()} className="btn btn-outline-secondary btn-sm"><i className="bi bi-brightness-high"></i></button>
                            <button type="button" disabled={invalidDescription()} className="btn btn-outline-secondary btn-sm"><i className="bi bi-0-circle"></i></button>
                        </div>
                    </div>

                    <div id="right_buttons" className="d-grid gap-2 d-md-flex">
                        <button type="button" disabled={isLoading} className="btn btn-primary btn-sm" onClick={handleAddEvent}>{
                            isLoading ?
                                <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                    < span className="visually-hidden">Loading...</span>
                                </div>
                                : invalidDescription() ?
                                    <i className="bi bi-x-lg"></i> :
                                    <i className="bi bi-plus-lg"></i>}
                        </button>

                    </div>

                </div>
            </div >
        </div >
    );

}