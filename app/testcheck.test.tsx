// app/components/DonateSection.test.tsx
import { render, screen } from '@testing-library/react';
import Home from './page';

test('renders donate text', () => {
    render(<Home />);
    expect(screen.getByText(/Donate Blood, Save Lives/i)).toBeInTheDocument();
});
