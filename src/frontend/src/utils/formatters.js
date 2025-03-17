/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {number|string} currency - The currency code (default: USD) or number of decimal places
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  // Handle NaN, undefined, or null values
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '$0.00';
  }
  
  // If currency is a number, treat it as decimal places
  if (typeof currency === 'number') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: currency,
      maximumFractionDigits: currency
    }).format(amount);
  }
  
  // Ensure currency is a valid 3-letter code
  const validCurrency = /^[A-Z]{3}$/.test(currency) ? currency : 'USD';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.warn(`Error formatting currency: ${error.message}. Using USD instead.`);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
};

/**
 * Format a date string
 * @param {string|Date} date - The date to format
 * @param {string} format - Optional format string (default: 'MMM d, yyyy')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'MMM d, yyyy') => {
  if (!date) return '';
  
  let d;
  
  try {
    // Handle ISO date strings (including those with time components)
    if (typeof date === 'string') {
      // Create a new Date object from the string
      // For YYYY-MM-DD format, we need to ensure proper parsing
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Split the date string into components
        const [year, month, day] = date.split('-').map(num => parseInt(num, 10));
        // Create date with correct month (months are 0-indexed in JS)
        d = new Date(year, month - 1, day);
      } else {
        d = new Date(date);
      }
      
      // Check if the date is valid
      if (isNaN(d.getTime())) {
        console.warn(`Invalid date string: ${date}`);
        return '';
      }
    } else if (date instanceof Date) {
      d = date;
    } else {
      console.warn(`Unsupported date type: ${typeof date}`);
      return '';
    }
    
    // Simple format implementation
    // In a real app, you might use a library like date-fns
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-11
    const day = d.getDate();
    
    // Create a new formatted string instead of using replacements
    let result = '';
    
    // Iterate through the format string
    for (let i = 0; i < format.length; i++) {
      // Check for format patterns
      if (format.substring(i, i + 4) === 'yyyy') {
        result += year;
        i += 3; // Skip the next 3 characters
      } else if (format.substring(i, i + 4) === 'MMMM') {
        result += fullMonths[month];
        i += 3; // Skip the next 3 characters
      } else if (format.substring(i, i + 3) === 'MMM') {
        result += months[month];
        i += 2; // Skip the next 2 characters
      } else if (format.substring(i, i + 2) === 'MM') {
        result += (month + 1).toString().padStart(2, '0');
        i += 1; // Skip the next character
      } else if (format.substring(i, i + 1) === 'M') {
        result += (month + 1);
      } else if (format.substring(i, i + 2) === 'dd') {
        result += day.toString().padStart(2, '0');
        i += 1; // Skip the next character
      } else if (format.substring(i, i + 1) === 'd') {
        result += day;
      } else {
        result += format[i];
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error formatting date:', error, date);
    return '';
  }
};

/**
 * Format a date as a relative time (e.g., "2 hours ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

/**
 * Format a number with commas as thousands separators
 * @param {number} number - The number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} - Formatted number string
 */
export const formatNumber = (number, decimals = 0) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

/**
 * Format a percentage
 * @param {number} value - The value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - Formatted percentage string
 */
export const formatPercent = (value, decimals = 2) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};

/**
 * Format file size in bytes to human-readable format
 * @param {number} bytes - The file size in bytes
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - Formatted file size string
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}; 