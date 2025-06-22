import { getCache, setCache } from '@/lib/cache';

// Format date to "MMM D" (e.g., "Jan 12")
const formatDate = (dateString) => {
  try {
    if (!dateString) throw new Error('Invalid date string');
    const date = new Date(dateString);
    if (isNaN(date.getTime())) throw new Error('Invalid date');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (error) {
    console.error('❌ Error formatting date:', error.message);
    return 'Invalid Date';
  }
};

// Format amount to Indian Rupee (e.g., "₹ 1,23,456.78")
const formatCurrency = (amount) => {
  try {
    if (typeof amount !== 'number' || isNaN(amount)) throw new Error('Invalid amount');
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (error) {
    console.error('❌ Error formatting currency:', error.message);
    return '₹ 0.00';
  }
};

// Format transaction object for display (with caching)
const formatTransaction = (transaction) => {
  if (!transaction) return null;

  const cacheKey = `formatted:transaction:${transaction.id}`;
  const cachedFormatted = getCache(cacheKey);
  if (cachedFormatted) {
    console.log('✅ Cache hit for formatted transaction:', transaction.id);
    return cachedFormatted;
  }

  try {
    const formatted = {
      ...transaction,
      date: formatDate(transaction.date),
      amount: formatCurrency(transaction.amount),
    };
    setCache(cacheKey, formatted, 300000); // Cache for 5 minutes
    return formatted;
  } catch (error) {
    console.error('❌ Error formatting transaction:', error.message);
    return transaction;
  }
};

export { formatDate, formatCurrency, formatTransaction };