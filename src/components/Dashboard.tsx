
import { useState, useEffect } from 'react';
import { CheckCircle2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { WelcomeSection } from './dashboard/WelcomeSection';
import { ProgressCard } from './dashboard/ProgressCard';
import { TaskConfigCard } from './dashboard/TaskConfigCard';
import { TaskList } from './dashboard/TaskList';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

interface User {
  name: string;
  email: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyTaskCount, setDailyTaskCount] = useState(5);

  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const handleAddTask = (newTask: { title: string; description: string }) => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        completed: false,
        createdAt: new Date()
      };
      setTasks(prev => [...prev, task]);
    }
  };

  const handleEditTask = (task: Task) => {
    setTasks(prev => prev.map(t => 
      t.id === task.id ? task : t
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleReorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const generateEmptyTasks = () => {
    const emptyTasksNeeded = Math.max(0, dailyTaskCount - tasks.length);
    const emptyTasks: Task[] = [];
    
    for (let i = 0; i < emptyTasksNeeded; i++) {
      emptyTasks.push({
        id: `empty-${Date.now()}-${i}`,
        title: '',
        description: '',
        completed: false,
        createdAt: new Date()
      });
    }
    
    setTasks(prev => [...prev, ...emptyTasks]);
  };

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    // Save tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-violet-500 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">TaskFlow</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Organize sua rotina</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="h-9 w-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <WelcomeSection user={user} />
        
        <ProgressCard 
          completedTasks={completedTasks}
          totalTasks={tasks.filter(t => t.title).length}
          completionPercentage={completionPercentage}
        />

        <TaskConfigCard 
          dailyTaskCount={dailyTaskCount}
          setDailyTaskCount={setDailyTaskCount}
          generateEmptyTasks={generateEmptyTasks}
        />

        <TaskList
          tasks={tasks}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onToggleCompletion={toggleTaskCompletion}
          onReorderTasks={handleReorderTasks}
        />
      </main>
    </div>
  );
};
