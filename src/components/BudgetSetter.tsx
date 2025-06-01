import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface BudgetSetterProps {
  currentBudget: number | null;
  onSetBudget: (budget: number) => void;
}

export function BudgetSetter({ currentBudget, onSetBudget }: BudgetSetterProps) {
  const [budget, setBudget] = useState<string>(currentBudget ? currentBudget.toString() : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!budget || isNaN(parseFloat(budget)) || parseFloat(budget) <= 0) {
      alert('الرجاء إدخال مبلغ صحيح للميزانية');
      return;
    }

    onSetBudget(parseFloat(budget));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-right">تحديد الميزانية الشهرية</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="budget" className="block text-right">الميزانية الشهرية</Label>
          <Input
            id="budget"
            type="number"
            step="0.01"
            min="0"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="أدخل مبلغ الميزانية الشهرية"
            className="w-full text-right"
            required
          />
        </div>

        <Button type="submit" className="w-full">حفظ الميزانية</Button>
        
        {currentBudget !== null && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md text-right">
            <p className="font-medium">الميزانية الحالية: {currentBudget}</p>
          </div>
        )}
      </form>
    </div>
  );
}
