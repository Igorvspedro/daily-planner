
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProgressCardProps {
  completedTasks: number;
  totalTasks: number;
  completionPercentage: number;
}

export const ProgressCard = ({ completedTasks, totalTasks, completionPercentage }: ProgressCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Progresso do Dia</h3>
            <p className="text-blue-100">
              {completedTasks} de {totalTasks} tarefas concluídas
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{completionPercentage}%</div>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {totalTasks} tarefas
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
  );
};
