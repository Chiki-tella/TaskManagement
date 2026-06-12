import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { LogOut, Plus, CheckCircle2, Circle, Clock, Trash2, Calendar, Flame, Star, Trophy, Loader2 } from 'lucide-react';
import Confetti from 'react-confetti';

export default function Dashboard() {
  const { userProfile, logout, checkSession } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [dueTasks, setDueTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('TODO');
  const [loading, setLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
  const [settings, setSettings] = useState({});
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editCron, setEditCron] = useState('0 0 9 * * *');
  const [editInterval, setEditInterval] = useState('60000');
  const isAdmin = userProfile?.roles?.includes('ROLE_ADMIN');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        const settingsMap = {};
        data.forEach(item => settingsMap[item.settingKey] = item.settingValue);
        setSettings(settingsMap);
        setEditCron(settingsMap['NOTIFICATION_CRON'] || '0 0 9 * * *');
        setEditInterval(settingsMap['FRONTEND_POLL_INTERVAL'] || '60000');
      }
    } catch (e) { console.error("Failed to fetch settings", e); }
  };

  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const xp = userProfile?.xp || 0;
  const level = userProfile?.level || 1;
  const streak = userProfile?.streak || 0;
  const nextLevelXp = level * 100;
  const xpProgress = Math.min((xp / nextLevelXp) * 100, 100);

  const motivationalQuotes = [
    "You're all caught up! Time to conquer the world... or take a nap.",
    "A clean slate. What will you achieve next?",
    "Empty lists are a sign of an empty mind... wait, no, a productive mind!",
    "Zero tasks left! You are basically a superhero now.",
    "Nothing to do here. Go outside and touch some grass."
  ];
  const [emptyQuote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  // New task modal state
  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchDueTasks();
    
    const pollInterval = parseInt(settings.FRONTEND_POLL_INTERVAL || '60000', 10);
    const interval = setInterval(() => {
      fetchDueTasks();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [statusFilter, settings.FRONTEND_POLL_INTERVAL]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'NOTIFICATION_CRON': editCron,
          'FRONTEND_POLL_INTERVAL': editInterval
        })
      });
      if (res.ok) {
        setShowSettingsModal(false);
        fetchSettings();
      }
    } catch (e) {
      console.error("Failed to save settings", e);
    } finally {
      setIsSavingSettings(false);
    }
  };

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchDueTasks = async () => {
    try {
      const res = await fetch('/api/tasks/due-soon');
      if (res.ok) {
        const data = await res.json();
        setDueTasks(data || []);
      }
    } catch (e) {
      console.error("Failed to fetch due tasks", e);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Using the paged endpoint to get tasks by status
      const res = await fetch(`/api/tasks/paged?status=${statusFilter}&page=0&size=50`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data.content || []);
      }
    } catch (e) {
      console.error("Failed to fetch tasks", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setIsCreatingTask(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDesc,
          priority: newTaskPriority,
          status: 'TODO',
          dueDate: newTaskDueDate || null
        })
      });
      if (res.ok) {
        setShowModal(false);
        setNewTaskTitle('');
        setNewTaskDesc('');
        setNewTaskPriority('MEDIUM');
        setNewTaskDueDate('');
        if (statusFilter === 'TODO') {
          fetchTasks();
        } else {
          setStatusFilter('TODO');
        }
        fetchDueTasks();
      }
    } catch (e) {
      console.error("Failed to create task", e);
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleCloseTask = async (id) => {
    setCompletingTaskId(id);
    try {
      const res = await fetch(`/api/tasks/${id}/close`, { method: 'PATCH' });
      if (res.ok) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
        fetchTasks();
        fetchDueTasks();
        if (checkSession) checkSession();
      }
    } catch (e) {
      console.error("Failed to close task", e);
    } finally {
      setCompletingTaskId(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={600} gravity={0.2} />}
      
      {/* Navigation */}
      <nav style={{ background: 'var(--surface-color)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--surface-border)', padding: '1rem 0', zIndex: 40, position: 'relative' }}>
        <div className="container" style={{ padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 auto', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>T</div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>TaskFlow</h1>
          </div>
          
          {/* Gamification Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1.25rem', borderRadius: '99px' }}>
            <div title="Daily Streak" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f97316', fontWeight: 'bold' }}>
              <Flame size={18} /> {streak}
            </div>
            <div style={{ width: '1px', height: '20px', background: 'var(--surface-border)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div title={`Level ${level}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fbbf24', fontWeight: 'bold' }}>
                <Trophy size={18} /> Lvl {level}
              </div>
              <div style={{ width: '100px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${xpProgress}%`, height: '100%', background: '#3b82f6', transition: 'width 0.5s ease-out' }}></div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{xp}/{nextLevelXp}</div>
            </div>
          </div>

          <button 
            onClick={async () => {
              setIsLoggingOut(true);
              await logout();
              setIsLoggingOut(false);
            }} 
            className="btn btn-secondary btn-sm" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container" style={{ flex: 1, padding: '2rem' }}>
        
        {/* Due Tasks Banner */}
        {dueTasks.length > 0 && (
          <div className="animate-fade-in" style={{ 
            background: 'rgba(248, 113, 113, 0.1)', 
            border: '1px solid rgba(248, 113, 113, 0.3)',
            borderRadius: '12px', 
            padding: '1.25rem', 
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ color: 'var(--priority-high)' }}>
              <Clock size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontWeight: 'bold', color: 'var(--priority-high)', fontSize: '1.1rem' }}>
                You have {dueTasks.length} task{dueTasks.length > 1 ? 's' : ''} due today or overdue!
              </h3>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Please review and complete them as soon as possible.
              </p>
            </div>
            <button 
              className="btn btn-sm"
              onClick={() => {
                setStatusFilter('TODO'); // or create a filter to show them exactly, but TODO is fine
              }}
              style={{ background: 'var(--priority-high)', color: 'white', border: 'none' }}
            >
              View Tasks
            </button>
          </div>
        )}

        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Your Tasks</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your daily goals and workflows.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {isAdmin && (
              <button onClick={() => setShowSettingsModal(true)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ⚙️ Settings
              </button>
            )}
            <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} /> New Task
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          {['TODO', 'IN_PROGRESS', 'DONE'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className="btn"
              style={{
                background: statusFilter === status ? 'var(--surface-color)' : 'transparent',
                border: '1px solid',
                borderColor: statusFilter === status ? 'var(--primary-color)' : 'var(--surface-border)',
                color: statusFilter === status ? 'var(--primary-color)' : 'var(--text-secondary)',
                borderRadius: '99px',
                padding: '0.5rem 1.25rem',
                fontSize: '0.875rem'
              }}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
              <div className="spinner"></div>
            </div>
          ) : tasks.length === 0 ? (
            <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }} className="animate-fade-in">
              <Star size={64} style={{ opacity: 0.2, margin: '0 auto 1.5rem', color: '#fbbf24' }} />
              <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '0.5rem' }}>{emptyQuote}</h3>
              <p>Why not create a new task and level up?</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-border)', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>Task</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>Priority</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>Due Date</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontWeight: '500', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="task-row animate-fade-in" style={{ borderBottom: '1px solid var(--surface-border)' }}>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{task.title}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{task.description}</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span className={`badge badge-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {task.dueDate ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={14} />
                          <span style={{ fontSize: '0.875rem' }}>{new Date(task.dueDate).toLocaleString()}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                      {task.status !== 'DONE' && (
                        <button 
                          onClick={() => handleCloseTask(task.id)}
                          className="btn btn-sm" 
                          style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-done)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                          disabled={completingTaskId === task.id}
                        >
                          {completingTaskId === task.id && <Loader2 size={14} className="animate-spin" />}
                          {completingTaskId === task.id ? 'Completing...' : 'Complete'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label className="input-label">Title</label>
                <input required type="text" className="input-field" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="E.g., Review PR #102" />
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea className="input-field" value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} placeholder="Provide more details..." rows={3}></textarea>
              </div>
              <div className="input-group">
                <label className="input-label">Priority</label>
                <select className="input-field select-field" value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value)}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Due Date & Time</label>
                <input type="datetime-local" className="input-field" value={newTaskDueDate} onChange={e => setNewTaskDueDate(e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} disabled={isCreatingTask}>
                  {isCreatingTask && <Loader2 size={18} className="animate-spin" />}
                  {isCreatingTask ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>System Settings</h3>
            <form onSubmit={handleSaveSettings}>
              <div className="input-group">
                <label className="input-label">Email Notification Cron</label>
                <input required type="text" className="input-field" value={editCron} onChange={e => setEditCron(e.target.value)} placeholder="0 0 9 * * *" />
              </div>
              <div className="input-group">
                <label className="input-label">Frontend Poll Interval (ms)</label>
                <input required type="number" className="input-field" value={editInterval} onChange={e => setEditInterval(e.target.value)} placeholder="60000" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowSettingsModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} disabled={isSavingSettings}>
                  {isSavingSettings && <Loader2 size={18} className="animate-spin" />}
                  {isSavingSettings ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
