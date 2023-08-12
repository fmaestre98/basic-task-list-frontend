import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskModel from '../models/TaskModel';
import { TaskList } from '../TaskApp/components/TaskList';


describe('TaskList', () => {

  const tasks: TaskModel[] = [
    { id: 1, description: 'Task 1', done: false, userId: 1 },
    { id: 2, description: 'Task 2', done: true, userId: 1 },
    { id: 3, description: 'Task 3', done: true, userId: 1 },
  ];

  test('should render a list of tasks', () => {

    const { getAllByTestId } = render(<TaskList tasks={tasks} />);
    const taskElements = getAllByTestId('task');

    expect(taskElements.length).toBe(3);
    expect(taskElements[0]).toHaveTextContent('Task 1');
    expect(taskElements[1]).toHaveTextContent('Task 2');
    expect(taskElements[2]).toHaveTextContent('Task 3');
  });

  test('el componente muestra las tareas correctamente con checkboxes seleccionados o no', () => {
    render(<TaskList tasks={tasks} />);
    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes.length).toBe(tasks.length);

    tasks.forEach((tasks, index) => {
      const checkbox = checkboxes[index];
      if (tasks.done) {
        expect(checkbox).toBeChecked();
      } else {
        expect(checkbox).not.toBeChecked();
      }
    });

  });
});
