import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '../components/ui/Button';

describe('Button Component', () => {
    it('renders children correctly', () => {
        render(<Button variant="primary">Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders with the primary variant classes', () => {
        render(<Button variant="primary">Primary Button</Button>);
        const button = screen.getByRole('button', { name: 'Primary Button' });
        expect(button).toBeInTheDocument();
    });

    it('renders with the ghost variant classes', () => {
        render(<Button variant="ghost">Ghost Button</Button>);
        const button = screen.getByRole('button', { name: 'Ghost Button' });
        expect(button).toBeInTheDocument();
    });

    it('handles fullWidth prop', () => {
        render(<Button variant="primary" fullWidth>Full Width</Button>);
        const button = screen.getByRole('button', { name: 'Full Width' });
        expect(button).toBeInTheDocument();
    });

    it('ignores clicks when disabled', () => {
        render(<Button variant="primary" disabled>Disabled</Button>);
        const button = screen.getByRole('button', { name: 'Disabled' });
        expect(button).toBeDisabled();
    });

    it('renders icon if provided', () => {
        render(<Button variant="primary" icon={<span data-testid="icon">ICON</span>}>Icon Button</Button>);
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
});
