
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskConfigCardProps {
  dailyTaskCount: number;
  setDailyTaskCount: (count: number) => void;
  generateEmptyTasks: () => void;
}

export const TaskConfigCard = ({ dailyTaskCount, setDailyTaskCount, generateEmptyTasks }: TaskConfigCardProps) => {
  return (
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
  );
};
