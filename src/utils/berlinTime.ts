/**
 * Berlin timezone utility functions
 */

/**
 * Get current date/time in Berlin timezone
 */
export const getBerlinDate = (): Date => {
  const now = new Date();
  const berlinTime = new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(now);

  const year = parseInt(berlinTime.find(p => p.type === 'year')?.value || '0');
  const month = parseInt(berlinTime.find(p => p.type === 'month')?.value || '0') - 1;
  const day = parseInt(berlinTime.find(p => p.type === 'day')?.value || '0');
  const hour = parseInt(berlinTime.find(p => p.type === 'hour')?.value || '0');
  const minute = parseInt(berlinTime.find(p => p.type === 'minute')?.value || '0');
  const second = parseInt(berlinTime.find(p => p.type === 'second')?.value || '0');

  return new Date(year, month, day, hour, minute, second);
};

/**
 * Get start of day in Berlin timezone
 */
export const getBerlinDayStart = (date?: Date): Date => {
  const targetDate = date || new Date();
  
  const berlinTime = new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false
  }).formatToParts(targetDate);

  const year = parseInt(berlinTime.find(p => p.type === 'year')?.value || '0');
  const month = parseInt(berlinTime.find(p => p.type === 'month')?.value || '0') - 1;
  const day = parseInt(berlinTime.find(p => p.type === 'day')?.value || '0');

  return new Date(year, month, day, 0, 0, 0, 0);
};

/**
 * Convert UTC date to Berlin timezone for comparison
 */
export const convertToBerlinTime = (utcDate: Date | string): Date => {
  const date = new Date(utcDate);
  
  const berlinTime = new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(date);

  const year = parseInt(berlinTime.find(p => p.type === 'year')?.value || '0');
  const month = parseInt(berlinTime.find(p => p.type === 'month')?.value || '0') - 1;
  const day = parseInt(berlinTime.find(p => p.type === 'day')?.value || '0');
  const hour = parseInt(berlinTime.find(p => p.type === 'hour')?.value || '0');
  const minute = parseInt(berlinTime.find(p => p.type === 'minute')?.value || '0');
  const second = parseInt(berlinTime.find(p => p.type === 'second')?.value || '0');

  return new Date(year, month, day, hour, minute, second);
};

/**
 * Format date in Berlin timezone for display
 */
export const formatBerlinTime = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const targetDate = new Date(date);
  
  return new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin',
    ...options
  }).format(targetDate);
};