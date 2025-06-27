
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, GripVertical, CheckCircle2, Circle, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from './ThemeToggle';
import { Badge } from '@/components/ui/badge';

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
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        completed: false,
        createdAt: new Date()
      };
      setTasks(prev => [...prev, task]);
      setNewTask({ title: '', description: '' });
      setIsAddingTask(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setTasks(prev => prev.map(t => 
      t.id === task.id ? task : t
    ));
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault();
    if (!draggedTask || draggedTask === targetTaskId) return;

    const draggedIndex = tasks.findIndex(task => task.id === draggedTask);
    const targetIndex = tasks.findIndex(task => task.id === targetTaskId);

    const newTasks = [...tasks];
    const [removed] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, removed);

    setTasks(newTasks);
    setDraggedTask(null);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
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
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {user.name}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Como está sua produtividade hoje?
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Progresso do Dia</h3>
                <p className="text-blue-100">
                  {completedTasks} de {tasks.filter(t => t.title).length} tarefas concluídas
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{completionPercentage}%</div>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {tasks.filter(t => t.title).length} tarefas
                </Badge>
              </div>
            </div>
            <div className="mt-4 bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Task Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Configuração Diária</span>
              <Button
                onClick={generateEmptyTasks}
                size="sm"
                variant="outline"
                className="ml-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Gerar Tarefas
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Label htmlFor="daily-tasks">Quantas tarefas você quer fazer hoje?</Label>
              <Select
                value={dailyTaskCount.toString()}
                onValueChange={(value) => setDailyTaskCount(parseInt(value))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Suas Tarefas</span>
              <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Tarefa
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Digite o título da tarefa"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={newTask.description}
                        onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descreva sua tarefa (opcional)"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleAddTask} className="flex-1">
                        Adicionar Tarefa
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma tarefa ainda. Que tal adicionar algumas?</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, task.id)}
                  className={`
                    flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
                    hover:shadow-md transition-all duration-200 cursor-move
                    ${task.completed ? 'opacity-60' : ''}
                    ${draggedTask === task.id ? 'opacity-50' : ''}
                  `}
                >
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 hover:text-green-500 transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    {task.title ? (
                      <>
                        <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {task.description}
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="text-gray-400 italic">Clique para editar esta tarefa</div>
                    )}
                  </div>

                  <div className="flex space-x-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Tarefa</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-title">Título</Label>
                            <Input
                              id="edit-title"
                              defaultValue={task.title}
                              onChange={(e) => setEditingTask(prev => prev ? { ...prev, title: e.target.value } : null)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-description">Descrição</Label>
                            <Textarea
                              id="edit-description"
                              defaultValue={task.description}
                              onChange={(e) => setEditingTask(prev => prev ? { ...prev, description: e.target.value } : null)}
                              rows={3}
                            />
                          </div>
                          <Button 
                            onClick={() => editingTask && handleEditTask(editingTask)}
                            className="w-full"
                          >
                            Salvar Alterações
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
