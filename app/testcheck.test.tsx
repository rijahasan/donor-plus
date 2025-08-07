import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WelcomeText from '../components/ui/WelcomeText'; // Adjust path as needed

test('renders welcome text', () => {
    render(<WelcomeText />);
    expect(screen.getByText(/Donate Blood, Save Lives/i)).toBeInTheDocument();
});
