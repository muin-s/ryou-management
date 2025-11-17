import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Save, X } from 'lucide-react';
import { MessItem } from '@/contexts/DataContext';
import { toast } from '@/hooks/use-toast';

interface MessFormProps {
  messItems: MessItem[];
  onUpdate: (messId: number, updates: any) => Promise<void>;
  onAdd: (messItem: any) => Promise<void>;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const MessForm: React.FC<MessFormProps> = ({ messItems, onUpdate, onAdd }) => {
  const messMap = React.useMemo(() => {
    const map = new Map<string, MessItem>();
    messItems.forEach(item => {
      map.set(item.day, item);
    });
    return map;
  }, [messItems]);

  const [editingDays, setEditingDays] = useState<Set<string>>(new Set());
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});

  const startEditing = (day: string, messItem?: MessItem) => {
    const newEditingDays = new Set(editingDays);
    newEditingDays.add(day);
    setEditingDays(newEditingDays);

    if (messItem) {
      setEditFormData(prev => ({
        ...prev,
        [day]: {
          breakfast: messItem.breakfast,
          lunch: messItem.lunch,
          snacks: messItem.snacks,
          dinner: messItem.dinner,
        }
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [day]: {
          breakfast: '',
          lunch: '',
          snacks: '',
          dinner: '',
        }
      }));
    }
  };

  const cancelEditing = (day: string) => {
    const newEditingDays = new Set(editingDays);
    newEditingDays.delete(day);
    setEditingDays(newEditingDays);
    
    setEditFormData(prev => {
      const updated = { ...prev };
      delete updated[day];
      return updated;
    });
  };

  const saveEdits = async (day: string) => {
    const messItem = messMap.get(day);
    const formData = editFormData[day];

    if (!formData) return;

    try {
      if (messItem) {
        await onUpdate(messItem.id, {
          day: day,
          breakfast: formData.breakfast,
          lunch: formData.lunch,
          snacks: formData.snacks,
          dinner: formData.dinner,
        });
      } else {
        await onAdd({
          day: day,
          breakfast: formData.breakfast,
          lunch: formData.lunch,
          snacks: formData.snacks,
          dinner: formData.dinner,
        });
      }
      
      const newEditingDays = new Set(editingDays);
      newEditingDays.delete(day);
      setEditingDays(newEditingDays);
      
      setEditFormData(prev => {
        const updated = { ...prev };
        delete updated[day];
        return updated;
      });
    } catch (error) {
      console.error('Error saving:', error);
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive",
      });
    }
  };

  const updateFormField = (day: string, field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      }
    }));
  };

  // helper to render comma-separated text as separate lines
  const renderLines = (text?: string) => {
    if (!text || text.trim() === '') return '—';
    return text.split(',').map((part, idx) => (
      <div key={idx} className="leading-tight">
        {part.trim()}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Manage Weekly Mess Menu
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Click on any day row to edit the menu
        </p>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-700">
                <TableRow className="border-b border-gray-200 dark:border-gray-600">
                  <TableHead className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 w-1/6">
                    Day
                  </TableHead>
                  <TableHead className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 w-1/5">
                    Breakfast
                  </TableHead>
                  <TableHead className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 w-1/5">
                    Lunch
                  </TableHead>
                  <TableHead className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 w-1/5">
                    Snacks
                  </TableHead>
                  <TableHead className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 w-1/5">
                    Dinner
                  </TableHead>
                  <TableHead className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 w-1/6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DAYS.map((day, index) => {
                  const messItem = messMap.get(day);
                  const isEditing = editingDays.has(day);
                  const formData = editFormData[day];

                  return (
                    <TableRow
                      key={day}
                      className={`border-b border-gray-200 dark:border-gray-600 ${
                        index % 2 === 0
                          ? 'bg-white dark:bg-gray-800'
                          : 'bg-gray-50 dark:bg-gray-750'
                      } ${isEditing ? 'bg-blue-50 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors`}
                    >
                      <TableCell className="py-4 px-4 text-gray-900 dark:text-gray-100 font-medium">
                        {day}
                      </TableCell>

                      {isEditing ? (
                        <>
                          <TableCell className="py-4 px-4">
                            <Input
                              placeholder="Breakfast"
                              value={formData?.breakfast || ''}
                              onChange={(e) => updateFormField(day, 'breakfast', e.target.value)}
                              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                            />
                          </TableCell>
                          <TableCell className="py-4 px-4">
                            <Input
                              placeholder="Lunch"
                              value={formData?.lunch || ''}
                              onChange={(e) => updateFormField(day, 'lunch', e.target.value)}
                              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                            />
                          </TableCell>
                          <TableCell className="py-4 px-4">
                            <Input
                              placeholder="Snacks"
                              value={formData?.snacks || ''}
                              onChange={(e) => updateFormField(day, 'snacks', e.target.value)}
                              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                            />
                          </TableCell>
                          <TableCell className="py-4 px-4">
                            <Input
                              placeholder="Dinner"
                              value={formData?.dinner || ''}
                              onChange={(e) => updateFormField(day, 'dinner', e.target.value)}
                              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                            />
                          </TableCell>
                          <TableCell className="py-4 px-4">
                            <div className="flex justify-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => saveEdits(day)}
                                className="bg-green-600 hover:bg-green-700 text-white gap-1"
                              >
                                <Save className="h-4 w-4" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => cancelEditing(day)}
                                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="py-4 px-4 text-gray-700 dark:text-gray-300 text-sm">
                            {renderLines(messItem?.breakfast)}
                          </TableCell>
                          <TableCell className="py-4 px-4 text-gray-700 dark:text-gray-300 text-sm">
                            {renderLines(messItem?.lunch)}
                          </TableCell>
                          <TableCell className="py-4 px-4 text-gray-700 dark:text-gray-300 text-sm">
                            {renderLines(messItem?.snacks)}
                          </TableCell>
                          <TableCell className="py-4 px-4 text-gray-700 dark:text-gray-300 text-sm">
                            {renderLines(messItem?.dinner)}
                          </TableCell>
                          <TableCell className="py-4 px-4">
                            <div className="flex justify-center">
                              <Button
                                size="sm"
                                onClick={() => startEditing(day, messItem)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                              >
                                {messItem ? 'Edit' : 'Add'}
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
