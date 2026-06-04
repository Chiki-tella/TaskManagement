import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { CheckCircle2, Trophy, Flame, Target, Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <nav style={{ background: 'var(--surface-color)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--surface-border)', padding: '1.5rem 0', zIndex: 40, position: 'relative' }}>
        <div className="container" style={{ padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>T</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, letterSpacing: '-0.5px' }}>TaskFlow</h1>
          </div>
          <div>
            {isAuthenticated ? (
              <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Go to Dashboard <ArrowRight size={18} />
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/login" className="btn btn-secondary">Log In</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container" style={{ flex: 1, padding: '4rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
        
        {/* Decorative background elements */}
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: '300px', height: '300px', background: 'rgba(59, 130, 246, 0.2)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: '300px', height: '300px', background: 'rgba(139, 92, 246, 0.2)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }}></div>

        <div style={{ zIndex: 10, maxWidth: '800px' }} className="animate-fade-in">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '99px', color: 'var(--primary-color)', fontWeight: '600', marginBottom: '2rem', fontSize: '0.875rem' }}>
            <Sparkles size={16} /> Productivity Meets Gamification
          </div>
          
          <h1 style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
            Conquer your tasks. <br/>
            <span style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Level up your life.
            </span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
            TaskFlow isn't just another boring to-do list. It's a game where you are the main character. Earn XP, build unbreakable streaks, and celebrate every victory.
          </p>

          {isAuthenticated ? (
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)' }}>
              Return to your Dashboard <ArrowRight size={20} />
            </button>
          ) : (
            <button onClick={() => navigate('/register')} className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)' }}>
              Start your journey today <ArrowRight size={20} />
            </button>
          )}
        </div>

        {/* Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%', marginTop: '5rem', zIndex: 10 }}>
          
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Trophy size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Earn XP & Level Up</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Every completed task grants you Experience Points. Watch your progress bar fill up and unlock new levels as you get things done.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Flame size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Build Daily Streaks</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Consistency is key. Maintain your daily momentum by completing at least one task every day to keep your streak alive.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Target size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Stay Organized</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Never miss a deadline. With built-in status tracking, priority flags, and smart due date sorting, your workflow has never been smoother.
            </p>
          </div>

        </div>
      </div>

      {/* Footer Section */}
      <footer style={{ background: 'var(--surface-color)', borderTop: '1px solid var(--surface-border)', padding: '2rem 0', marginTop: 'auto', zIndex: 10, position: 'relative' }}>
        <div className="container" style={{ padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 auto', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>T</div>
            <span style={{ fontWeight: 'bold' }}>TaskFlow</span>
            <span style={{ fontSize: '0.875rem' }}>&copy; {new Date().getFullYear()}</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-color)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Privacy</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-color)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Terms</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-color)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
