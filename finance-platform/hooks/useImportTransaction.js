// hooks/useImportTransaction.js
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const useImportTransaction = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importedData, setImportedData] = useState(null);

  const importReceipt = async (file) => {
    setIsImporting(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "Google Gemini API key is missing. Please set NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY in your .env file."
        );
      }
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: file.type,
            data: base64.split(",")[1],
          },
        },
      ]);
      const response = await result.response;
      let text = response.text();
      text = text.replace(/```json\n|```/g, "").trim();
      const extractedData = JSON.parse(text);
      const date = extractedData.date
        ? new Date(extractedData.date)
        : new Date();
      const amount = extractedData.amount
        ? -Math.abs(Number(extractedData.amount))
        : 0;
      const payee = extractedData.payee || "Unknown Merchant";
      const notes = "Imported from receipt";
      setImportedData({
        date,
        accountId: "",
        categoryId: "",
        payee,
        amount,
        notes,
      });
      return { success: true };
    } catch (err) {
      console.error("❌ Error importing receipt:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to import receipt";
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

export { useImportTransaction };
