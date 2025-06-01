/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PieChart, Pie, Cell as PieCell, Legend } from 'recharts';

interface Expense {
  id: string;
  amount: number;
  date: string;
  category: string;
  description: string;
}

interface ExpenseReportProps {
  expenses: Expense[];
  period: 'week' | 'month';
}

export function ExpenseReport({ expenses, period }: ExpenseReportProps) {
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [averageSpending, setAverageSpending] = useState<number>(0);

  // Colors for pie chart
  const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];
  
  // Category names in Arabic
  const categoryNames = {
    necessary: 'ضروري',
    unnecessary: 'غير ضروري',
    other: 'أخرى'
  };

  useEffect(() => {
    if (expenses.length === 0) {
      setDailyData([]);
      setCategoryData([]);
      setAverageSpending(0);
      return;
    }

    // Filter expenses based on selected period
    const now = new Date();
    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      if (period === 'week') {
        // Get expenses from the last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return expenseDate >= weekAgo && expenseDate <= now;
      } else {
        // Get expenses from the current month
        return expenseDate.getMonth() === now.getMonth() && 
               expenseDate.getFullYear() === now.getFullYear();
      }
    });

    // Group expenses by date
    const expensesByDate = filteredExpenses.reduce((acc, expense) => {
      const date = expense.date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array for chart
    const dailyDataArray = Object.entries(expensesByDate).map(([date, amount]) => {
      // Format date to be more readable
      const formattedDate = new Date(date).toLocaleDateString('ar-SA', { 
        day: 'numeric',
        month: 'short'
      });
      
      return {
        date: formattedDate,
        amount,
        fullDate: date // Keep original date for sorting
      };
    });

    // Sort by date
    dailyDataArray.sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
    
    // Calculate average spending
    const totalSpending = dailyDataArray.reduce((sum, day) => sum + day.amount, 0);
    const avgSpending = dailyDataArray.length > 0 ? totalSpending / dailyDataArray.length : 0;
    
    // Group expenses by category
    const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array for pie chart
    const categoryDataArray = Object.entries(expensesByCategory).map(([category, amount]) => ({
      name: categoryNames[category as keyof typeof categoryNames] || category,
      value: amount
    }));

    setDailyData(dailyDataArray);
    setCategoryData(categoryDataArray);
    setAverageSpending(avgSpending);
  }, [expenses, period]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-right">
        {period === 'week' ? 'تقرير الإنفاق الأسبوعي' : 'تقرير الإنفاق الشهري'}
      </h2>
      
      {expenses.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد بيانات كافية لعرض التقرير</p>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-right">الإنفاق اليومي</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#8884d8">
                    {dailyData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.amount > averageSpending ? '#FF8042' : '#8884d8'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="text-xs text-center mt-2 text-gray-500">
                * الأعمدة البرتقالية تشير إلى أيام تجاوز فيها الإنفاق المتوسط اليومي
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-right">توزيع النفقات حسب التصنيف</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <PieCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-100 p-3 rounded-md">
            <h3 className="text-lg font-semibold mb-2 text-right">ملخص</h3>
            <ul className="space-y-1 text-right">
              <li>إجمالي الإنفاق: {dailyData.reduce((sum, day) => sum + day.amount, 0).toFixed(2)}</li>
              <li>متوسط الإنفاق اليومي: {averageSpending.toFixed(2)}</li>
              <li>عدد أيام الإنفاق: {dailyData.length}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
