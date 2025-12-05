export const calculateReadingTime = (text: string): string => {
  if (!text) return "0 хв. читання";

  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;

  if (wordCount === 0) return "0 хв. читання";

  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} хв. читання`;
};

export const formatDate = (timestamp: number): string => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  return date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).replace('.', '');
};