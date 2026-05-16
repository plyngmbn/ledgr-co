"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useBudget } from "@/lib/budget-context";
import { CATEGORIES, MONTHS } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SpendingFormProps {
  selectedMonth: number;
  selectedYear: number;
}

export function SpendingForm({ selectedMonth, selectedYear }: SpendingFormProps) {
  const [date, setDate] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const { addSpendingRecord, getSpendingForMonth, deleteSpendingRecord } = useBudget();

  const records = getSpendingForMonth(selectedMonth, selectedYear);
  const totalSpent = records.reduce((sum, r) => sum + r.amount, 0);

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleSubmit = () => {
    if (!date || !category || !amount) return;

    addSpendingRecord({
      date: parseInt(date),
      category,
      description,
      amount: parseFloat(amount),
      month: selectedMonth,
      year: selectedYear,
    });

    setDate("");
    setCategory("");
    setDescription("");
    setAmount("");
  };

  const isValid = date && category && amount && parseFloat(amount) > 0;

  const formatCurrency = (value: number) => {
    return `₱${value.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="space-y-6">
      {/* Add Form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Add Spending Record - {MONTHS[selectedMonth]} {selectedYear}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Date</label>
            <Select value={date} onValueChange={setDate}>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {days.map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Description (optional)
            </label>
            <Input
              type="text"
              placeholder="e.g., Lunch at restaurant"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Amount (₱)</label>
            <Input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Record
        </Button>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">
            Spending Sheet - {MONTHS[selectedMonth]} {selectedYear}
          </h3>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-lg font-bold text-emerald-600">{formatCurrency(totalSpent)}</p>
          </div>
        </div>

        {records.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            No records yet. Add your first spending record above!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">Category</th>
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">Description</th>
                  <th className="text-right py-2 px-2 text-gray-500 font-medium">Amount</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {records
                  .sort((a, b) => a.date - b.date)
                  .map((record) => (
                    <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-700">{record.date}</td>
                      <td className="py-2 px-2 text-gray-700">{record.category}</td>
                      <td className="py-2 px-2 text-gray-500">{record.description || "-"}</td>
                      <td className="py-2 px-2 text-right text-gray-700 font-medium">
                        {formatCurrency(record.amount)}
                      </td>
                      <td className="py-2 px-2">
                        <button
                          onClick={() => deleteSpendingRecord(record.id)}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
