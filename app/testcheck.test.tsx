// // app/page.test.tsx
// import { render, screen } from '@testing-library/react';
// import Home from './page';

// describe('Home page', () => {
//     it('renders the heading', () => {
//         render(<Home />);
//         expect(screen.getByText(/Donate Blood, Save Lives/i)).toBeInTheDocument();
//     });
// });
// App.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';

test('renders welcome text', () => {
    render(<Home />);
    expect(screen.getByText(/Donate Blood, Save Lives/i)).toBeInTheDocument();
});
