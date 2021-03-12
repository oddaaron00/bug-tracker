import { render } from '@testing-library/react';
import Login from '../components/Login';

test('should render login form', () => {
    render(<Login />);
});