
import { useState } from 'react';
import { Edit, Trash2, GripVertical, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EditTaskForm } from './EditTaskForm';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleCompletion: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, taskId: string) => void;
  isDragged: boolean;
}

export const TaskItem = ({
  task,
  onEdit,
  onDelete,
  onToggleCompletion,
  onDragStart,
  onDragOver,
  onDrop,
  isDragged
}: TaskItemProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditSubmit = (editedTask: Task) => {
    onEdit(editedTask);
    setIsEditDialogOpen(false);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, task.id)}
      className={`
        flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
        hover:shadow-md transition-all duration-200 cursor-move
        ${task.completed ? 'opacity-60' : ''}
        ${isDragged ? 'opacity-50' : ''}
      `}
    >
      <GripVertical className="h-4 w-4 text-gray-400" />
      
      <button
        onClick={() => onToggleCompletion(task.id)}
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
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Tarefa</DialogTitle>
            </DialogHeader>
            <EditTaskForm
              task={task}
              onSubmit={handleEditSubmit}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
