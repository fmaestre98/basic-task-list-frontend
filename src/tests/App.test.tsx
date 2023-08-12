import React from 'react';
import { render, screen} from '@testing-library/react';
import App from '../App';

test('renders Type to add new task text', () => {
  render(<App />);
  const text = screen.getByText(/Type to add new task/i);
  expect(text).toBeInTheDocument();
});
