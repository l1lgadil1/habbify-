'use client';

import { useState } from 'react';
import { Habit, HabitFrequency } from '@/shared/types/habit.types';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { useToast } from '@/shared/hooks/use-toast';

interface HabitFormProps {
  onSubmit: (habit: Omit<Habit, 'id' | 'progress' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Habit;
  trigger?: React.ReactNode;
}

export function HabitForm({ onSubmit, initialData, trigger }: HabitFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    frequency: initialData?.frequency || 'daily' as HabitFrequency,
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    timeOfDay: initialData?.timeOfDay || '',
    color: initialData?.color || '#4F46E5',
    icon: initialData?.icon || '📝',
    isArchived: initialData?.isArchived || false,
    goal: initialData?.goal || 30,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      ...(initialData && { id: initialData.id, progress: initialData.progress }),
    });
    setOpen(false);
    toast({
      title: initialData ? "Habit Updated" : "Habit Created",
      description: `"${formData.name}" has been ${initialData ? 'updated' : 'created'}.`,
    });
    // Reset form if not editing
    if (!initialData) {
      setFormData({
        name: '',
        description: '',
        frequency: 'daily',
        startDate: new Date().toISOString().split('T')[0],
        timeOfDay: '',
        color: '#4F46E5',
        icon: '📝',
        isArchived: false,
        goal: 30,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default">
            {initialData ? 'Edit Habit' : 'Add Habit'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[min(calc(100vw-32px),425px)] h-[calc(100vh-32px)] flex flex-col p-4">
        <DialogHeader className="px-2">
          <DialogTitle>{initialData ? 'Edit Habit' : 'Create New Habit'}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4 px-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value: HabitFrequency) => setFormData(prev => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeOfDay">Time of Day</Label>
                <Input
                  id="timeOfDay"
                  type="time"
                  value={formData.timeOfDay}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="h-10 px-1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Monthly Goal</Label>
                <Input
                  id="goal"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.goal}
                  onChange={handleInputChange}
                  required
                  className="h-10"
                />
              </div>
            </div>

            <div className="sticky bottom-0 pt-4 pb-2 bg-background flex justify-end gap-2 px-2 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="h-9"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="h-9"
              >
                {initialData ? 'Save Changes' : 'Create Habit'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 