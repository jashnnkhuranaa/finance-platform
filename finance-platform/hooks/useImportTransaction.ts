// hooks/useImportTransaction.ts
'use client';

import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface TransactionFormValues {
  date: Date;
  accountId: string;
  categoryId: string;
  payee: string;
  amount: number;
  notes?: string;
}

export const useImportTransaction = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importedData, setImportedData] = useState<TransactionFormValues | null>(null);

  const importReceipt = async (file: File) => {
    setIsImporting(true);
    try {
      // Check if API key exists
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Google Gemini API key is missing. Please set NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY in your .env file.');
      }

      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      // Initialize Gemini API
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Prepare prompt
      const prompt = `
        Extract the following details from this receipt image:
        - Date (format: YYYY-MM-DD, if not found use today)
        - Payee (merchant name or store name)
        - Amount (total amount as a positive number, if not found use 0)

        Return the result in JSON format like:
        {
          "date": "YYYY-MM-DD",
          "payee": "Merchant Name",
          "amount": 123.45
        }
      `;

      // Call Gemini API
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: file.type,
            data: base64.split(',')[1],
          },
        },
      ]);

      const response = await result.response;
      let text = response.text();

      // Clean response if it contains markdown or extra text
      text = text.replace(/```json\n|```/g, '').trim();
      const extractedData = JSON.parse(text);

      // Process extracted data
      const date = extractedData.date
        ? new Date(extractedData.date)
        : new Date();
      const amount = extractedData.amount
        ? -Math.abs(Number(extractedData.amount)) // Negative for expense
        : 0;
      const payee = extractedData.payee || 'Unknown Merchant';
      const notes = 'Imported from receipt';

      setImportedData({
        date,
        accountId: '', // Will be set later
        categoryId: '', // Will be set later
        payee,
        amount,
        notes,
      });

      return { success: true };
    } catch (err: unknown) {
      console.error('❌ Error importing receipt:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to import receipt';
      return { error: errorMessage };
    } finally {
      setIsImporting(false);
    }
  };

  const clearImportedData = () => {
    setImportedData(null);
  };

  return { isImporting, importedData, importReceipt, clearImportedData };
};