import { Button } from './ui/button';

interface Expense {
  id: string;
  amount: number;
  date: string;
  category: string;
  description: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  // Function to translate category to Arabic
  const getCategoryInArabic = (category: string) => {
    switch (category) {
      case 'necessary':
        return 'ضروري';
      case 'unnecessary':
        return 'غير ضروري';
      case 'other':
        return 'أخرى';
      default:
        return category;
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-right">النفقات الأخيرة</h2>
      
      {expenses.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد نفقات مسجلة بعد</p>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="p-3 border rounded-md flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => onDeleteExpense(expense.id)}
                  className="h-7 px-2"
                >
                  حذف
                </Button>
                <div className="text-right">
                  <span className="font-bold text-lg">{expense.amount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  expense.category === 'necessary' 
                    ? 'bg-green-100 text-green-800' 
                    : expense.category === 'unnecessary'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {getCategoryInArabic(expense.category)}
                </span>
                <span>{formatDate(expense.date)}</span>
              </div>
              
              {expense.description && (
                <p className="mt-2 text-sm text-gray-600 text-right">{expense.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
