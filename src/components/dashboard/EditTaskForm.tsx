
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

interface EditTaskFormProps {
  task: Task;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
}

export const EditTaskForm = ({ task, onSubmit, onCancel }: EditTaskFormProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSubmit = () => {
    onSubmit({
      ...task,
      title,
      description
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="edit-title">Título</Label>
        <Input
          id="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="edit-description">Descrição</Label>
        <Textarea
          id="edit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <Button onClick={handleSubmit} className="w-full">
        Salvar Alterações
      </Button>
    </div>
  );
};
