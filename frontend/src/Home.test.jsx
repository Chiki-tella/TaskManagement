import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Home from './Home';

describe('Home Component', () => {
  it('renders the hero section correctly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </BrowserRouter>
    );

    // Check if the main heading is present
    expect(screen.getByText(/Conquer your tasks/i)).toBeInTheDocument();
    
    // Check if the gamification text is present
    expect(screen.getByText(/Productivity Meets Gamification/i)).toBeInTheDocument();
  });

  it('shows login/signup buttons when not authenticated', () => {
    // Note: since the default mocked AuthContext will be unauthenticated, 
    // we should see the sign-up and log in buttons.
    render(
      <BrowserRouter>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
});
