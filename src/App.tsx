import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { BudgetSetter } from '@/components/BudgetSetter';
import { ExpenseReport } from '@/components/ExpenseReport';
import './App.css';

// Define the Expense type
interface Expense {
  id: string;
  amount: number;
  date: string;
  category: string;
  description: string;
}

function App() {
  // State for expenses and budget
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reportPeriod, setReportPeriod] = useState<'week' | 'month'>('week');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedBudget = localStorage.getItem('budget');
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    
    if (savedBudget) {
      setBudget(JSON.parse(savedBudget));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    if (budget !== null) {
      localStorage.setItem('budget', JSON.stringify(budget));
    }
  }, [budget]);

  // Handler for adding a new expense
  const handleAddExpense = (expense: Expense) => {
    setExpenses(prevExpenses => [expense, ...prevExpenses]);
  };

  // Handler for deleting an expense
  const handleDeleteExpense = (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
  };

  // Handler for setting the budget
  const handleSetBudget = (newBudget: number) => {
    setBudget(newBudget);
  };

  // Calculate total spent this month
  const calculateMonthlySpent = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      })
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const monthlySpent = calculateMonthlySpent();

  return (
    <div className="min-h-screen bg-gray-100 p-4" dir="rtl">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold">تطبيق تتبع النفقات</h1>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md mx-auto">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="dashboard">الرئيسية</TabsTrigger>
          <TabsTrigger value="add">إضافة نفقة</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {budget !== null && (
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2 text-right">ملخص الميزانية الشهرية</h2>
              <div className="flex justify-between items-center mb-2">
                <span>المتبقي: {(budget - monthlySpent).toFixed(2)}</span>
                <span>الميزانية: {budget.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${monthlySpent > budget ? 'bg-red-600' : 'bg-blue-600'}`}
                  style={{ width: `${Math.min((monthlySpent / budget) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="mt-2 text-left">
                <span>الإنفاق: {monthlySpent.toFixed(2)}</span>
              </div>
            </div>
          )}

          <BudgetSetter currentBudget={budget} onSetBudget={handleSetBudget} />
          
          <ExpenseList 
            expenses={expenses.slice(0, 5)} 
            onDeleteExpense={handleDeleteExpense} 
          />
        </TabsContent>

        <TabsContent value="add">
          <ExpenseForm onAddExpense={handleAddExpense} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  reportPeriod === 'week' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setReportPeriod('week')}
              >
                أسبوعي
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  reportPeriod === 'month' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setReportPeriod('month')}
              >
                شهري
              </button>
            </div>
          </div>

          <ExpenseReport expenses={expenses} period={reportPeriod} />
          
          <ExpenseList 
            expenses={expenses} 
            onDeleteExpense={handleDeleteExpense} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
