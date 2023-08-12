import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { TaskForm } from '../TaskApp/components/TaskForm';



describe('TaskForm', () => {

    test('shows content editable component with event click', () => {
        const newTask = jest.fn();
        render(<TaskForm newTask={newTask} />);
        const div = screen.getByTestId("new_task");
        fireEvent.click(div);
        const form = screen.getByTestId("div_content_editable");
        expect(form).toBeInTheDocument();

    });

    test('hide content editable component with event click on ok button if the text is empty', () => {
        const newTask = jest.fn();
        render(<TaskForm newTask={newTask} />);
        const div = screen.getByTestId("new_task");
        fireEvent.click(div);
        const button = screen.getByTestId("ok_button");
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        expect(div).toBeInTheDocument();

    });

    test('actions buttons disabled when text is empty', () => {
        const newTask = jest.fn();
        render(<TaskForm newTask={newTask} />);
        const div = screen.getByTestId("new_task");
        fireEvent.click(div);
        const buttons_container = screen.getByTestId("actions_buttons");
        const actions_buttons = buttons_container.querySelectorAll("button");

        actions_buttons.forEach((button) => {
            expect(button).toBeDisabled();
        });

    });

    test('actions buttons enables when text is not empty', async () => {
        const newTask = jest.fn();
        render(<TaskForm newTask={newTask} />);
        const div = screen.getByTestId("new_task");

        fireEvent.click(div);

        const div_content = screen.getByTestId("div_content_editable");
        await act(async() => {
            await userEvent.click(div_content);
            await userEvent.keyboard("enviar a");

        });
        const buttons_container = screen.getByTestId("actions_buttons");
        const actions_buttons = buttons_container.querySelectorAll("button");

        actions_buttons.forEach((button) => {
            expect(button).toBeEnabled();
        });

    });

    test('content_editable work fine with mentions Hashtag and Links', async () => {
        const newTask = jest.fn();
        render(<TaskForm newTask={newTask} />);
        const div = screen.getByTestId("new_task");

        fireEvent.click(div);

        const div_content = screen.getByTestId("div_content_editable");
        await act(async() => {
            await userEvent.click(div_content);
            await userEvent.keyboard("enviar a @maria #tesis del sitio https://www.freecodecamp.org/news/how-to-write-a-regular-expression-for-a-url por via email a maria@log.com");

        });
        expect(div_content.innerHTML).toBe(' enviar a <span class="green text-success"> @maria</span> <span class="blue text-primary">#tesis</span> del sitio <span class="purple text-warning">https://www.freecodecamp.org/news/how-to-write-a-regular-expression-for-a-url</span> por via email a <span class="red text-danger">maria@log.com</span>');

    });
});
