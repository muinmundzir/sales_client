export const formatCurrencyIDR = (amount: any) => {
  const number = parseFloat(amount);
  
  if (isNaN(number)) {
    return 'Invalid amount';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};
