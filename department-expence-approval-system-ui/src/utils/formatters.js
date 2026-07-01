import { format, parseISO } from 'date-fns';

export const formatDate = (dateString, formatStr = 'dd MMM yyyy') => {
  if (!dateString) return '—';
  try {
    return format(parseISO(dateString), formatStr);
  } catch {
    return dateString;
  }
};

export const formatCurrency = (amount) => {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Converts enum values like OFFICE_SUPPLIES -> Office Supplies
 */
export const formatEnum = (value) => {
  if (!value) return '—';
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
