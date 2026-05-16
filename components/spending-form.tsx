"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase-client"; // Import your client
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

const getReactionMessage = (amount: number, dailyAvg: number) => {
  if (amount >= 1000) return "Ouch! 😬 That hurt the wallet";
  if (amount >= 500) return "Big spend alert! 👀 You sure about that?";
  if (amount >= 200) return "Not bad, not great. 😅 Stay on track!";
  if (dailyAvg > 0 && amount < dailyAvg * 0.5) return "Slay! 💅 Under budget today";
  return "Logged! Keep tracking bestie 🫡";
};

export function SpendingForm({ selectedMonth, selectedYear }: SpendingFormProps) {
  const [date, setDate] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [reaction, setReaction] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]); // Store records locally after fetch

  // 1. Fetch records from Supabase on load or when month/year changes
  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from("records")
      .select("*")
      .eq("month", selectedMonth)
      .eq("year", selectedYear)
      .order("date", { ascending: true });

    if (error) console.error("Error fetching:", error);
    else setRecords(data || []);
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedMonth, selectedYear]);

  const totalSpent = records.reduce((sum, r) => sum + r.amount, 0);
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // 2. Handle Add Record to Supabase
  const handleSubmit = async () => {
    if (!date || !category || !amount) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please log in first!");

    const numAmount = parseFloat(amount);
    const dailyAvg = records.length > 0 ? totalSpent / new Date().getDate() : 0;

    const { error } = await supabase.from("records").insert([
      {
        date: parseInt(date),
        category,
        description,
        amount: numAmount,
        month: selectedMonth,
        year: selectedYear,
        user_id: user.id, // Links to your account
      },
    ]);

    if (error) {
      alert("Error saving record: " + error.message);
    } else {
      setReaction(getReactionMessage(numAmount, dailyAvg));
      setTimeout(() => setReaction(null), 3000);
      
      // Reset form and refresh list
      setDate("");
      setCategory("");
      setDescription("");
      setAmount("");
      fetchRecords();
    }
  };

  // 3. Handle Delete from Supabase
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("records").delete().eq("id", id);
    if (error) alert("Could not delete record");
    else fetchRecords();
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
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Add Spending Record - {MONTHS[selectedMonth]} {selectedYear}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">Date</label>
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
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">Category</label>
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
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">Description (optional)</label>
            <Input
              type="text"
              placeholder="e.g., Lunch at restaurant"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">Amount (₱)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
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

        {reaction && (
          <div className="mt-3 text-sm font-medium text-emerald-600 animate-pulse">
            {reaction}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
            Spending Sheet - {MONTHS[selectedMonth]} {selectedYear}
          </h3>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total spent so far</p>
            <p className="text-lg font-bold text-emerald-600">{formatCurrency(totalSpent)}</p>
          </div>
        </div>

        {records.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            No records found in the cloud. Add one above!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-2 px-2 text-gray-500">Date</th>
                  <th className="text-left py-2 px-2 text-gray-500">Category</th>
                  <th className="text-left py-2 px-2 text-gray-500">Description</th>
                  <th className="text-right py-2 px-2 text-gray-500">Amount</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{record.date}</td>
                    <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{record.category}</td>
                    <td className="py-2 px-2 text-gray-500">{record.description || "-"}</td>
                    <td className="py-2 px-2 text-right text-gray-700 dark:text-gray-300 font-medium">
                      {formatCurrency(record.amount)}
                    </td>
                    <td className="py-2 px-2">
                      <button
                        onClick={() => handleDelete(record.id)}
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
