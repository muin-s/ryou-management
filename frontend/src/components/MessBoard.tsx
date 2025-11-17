import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessItem } from '@/contexts/DataContext';

interface MessBoardProps {
  messItems: MessItem[];
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const MessBoard: React.FC<MessBoardProps> = ({ messItems }) => {
  // Create a map of days to mess items for quick lookup
  const messMap = React.useMemo(() => {
    const map = new Map<string, MessItem>();
    messItems.forEach(item => map.set(item.day, item));
    return map;
  }, [messItems]);

  // Get today's day name
  const today = DAYS[new Date().getDay()];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Weekly Mess Menu
        </h2>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-100 dark:bg-gray-700">
                <TableRow className="border-b border-gray-200 dark:border-gray-600">
                  <TableHead className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 w-1/5">
                    Day
                  </TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 w-1/5">
                    <div className="flex flex-col">
                      <span>Breakfast</span>
                      <span className="text-xs font-normal text-gray-500 dark:text-gray-300">
                        7:30 AM – 9:00 AM
                      </span>
                    </div>
                  </TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 w-1/5">
                    <div className="flex flex-col">
                      <span>Lunch</span>
                      <span className="text-xs font-normal text-gray-500 dark:text-gray-300">
                        12:00 PM – 2:00 PM
                      </span>
                    </div>
                  </TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 w-1/5">
                    <div className="flex flex-col">
                      <span>Snacks</span>
                      <span className="text-xs font-normal text-gray-500 dark:text-gray-300">
                        5:30 PM – 6:30 PM
                      </span>
                    </div>
                  </TableHead>
                  <TableHead className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 w-1/5">
                    <div className="flex flex-col">
                      <span>Dinner</span>
                      <span className="text-xs font-normal text-gray-500 dark:text-gray-300">
                        7:30 PM – 9:30 PM
                      </span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DAYS.map((day) => {
                  const messItem = messMap.get(day);
                  const isToday = day === today;

                  // Helper function to format items by splitting on commas
                  const formatItems = (text?: string) =>
                    text ? text.split(',').map(item => item.trim()).join('\n') : '—';

                  return (
                    <TableRow
                      key={day}
                      className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${isToday
                          ? 'bg-blue-50 dark:bg-blue-900/30'
                          : 'bg-white even:bg-gray-50 dark:bg-gray-800'
                        } hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      <TableCell
                        className={`py-4 px-4 font-medium ${isToday
                            ? 'text-blue-700 dark:text-blue-300 font-semibold'
                            : 'text-gray-900 dark:text-gray-100'
                          }`}
                      >
                        {day}
                      </TableCell>

                      <TableCell className="py-4 px-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {formatItems(messItem?.breakfast)}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {formatItems(messItem?.lunch)}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {formatItems(messItem?.snacks)}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {formatItems(messItem?.dinner)}
                      </TableCell>
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
