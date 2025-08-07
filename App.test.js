// App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome text', () => {
    render(<App />);
    expect(screen.getByText(/Donate Blood, Save Lives/i)).toBeInTheDocument();
});
