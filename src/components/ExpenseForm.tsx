import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';

interface ExpenseFormProps {
  onAddExpense: (expense: {
    id: string;
    amount: number;
    date: string;
    category: string;
    description: string;
  }) => void;
}

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<string>('necessary');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert('الرجاء إدخال مبلغ صحيح');
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      date,
      category,
      description
    };

    onAddExpense(newExpense);
    
    // Reset form
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('necessary');
    setDescription('');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-right">إضافة نفقة جديدة</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="block text-right">المبلغ</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="أدخل المبلغ"
            className="w-full text-right"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="block text-right">التاريخ</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full text-right"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="block text-right">التصنيف</Label>
          <RadioGroup value={category} onValueChange={setCategory} className="flex flex-col space-y-2">
            <div className="flex items-center justify-end space-x-2 space-x-reverse">
              <Label htmlFor="necessary" className="text-right">ضروري</Label>
              <RadioGroupItem value="necessary" id="necessary" />
            </div>
            <div className="flex items-center justify-end space-x-2 space-x-reverse">
              <Label htmlFor="unnecessary" className="text-right">غير ضروري</Label>
              <RadioGroupItem value="unnecessary" id="unnecessary" />
            </div>
            <div className="flex items-center justify-end space-x-2 space-x-reverse">
              <Label htmlFor="other" className="text-right">أخرى</Label>
              <RadioGroupItem value="other" id="other" />
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="block text-right">الوصف (اختياري)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="أدخل وصفاً للنفقة"
            className="w-full text-right"
          />
        </div>

        <Button type="submit" className="w-full">إضافة النفقة</Button>
      </form>
    </div>
  );
}
