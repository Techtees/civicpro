/**
 * Formats a date string into a human-readable format
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string | Date | undefined): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Returns the color class for a given party
 * @param party Political party name
 * @returns CSS class for the party color
 */
export function getPartyColor(party: string): string {
  switch(party) {
    case 'Democratic':
      return 'text-primary-600 bg-primary-100';
    case 'Republican':
      return 'text-red-600 bg-red-100';
    case 'Independent':
      return 'text-amber-600 bg-amber-100';
    case 'Forward Guernsey':
      return 'text-primary-600 bg-primary-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

/**
 * Returns the color class for a promise status
 * @param status Promise status
 * @returns CSS class for the status color
 */
export function getPromiseStatusColor(status: string): string {
  switch(status) {
    case 'Fulfilled':
      return 'text-green-600 bg-green-100';
    case 'InProgress':
      return 'text-amber-600 bg-amber-100';
    case 'Unfulfilled':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

/**
 * Returns the color class for a vote
 * @param vote Vote value
 * @returns CSS class for the vote color
 */
export function getVoteColor(vote: string): string {
  switch(vote) {
    case 'For':
      return 'text-green-800 bg-green-100';
    case 'Against':
      return 'text-red-800 bg-red-100';
    case 'Abstained':
      return 'text-amber-800 bg-amber-100';
    case 'Absent':
      return 'text-gray-800 bg-gray-100';
    default:
      return 'text-gray-800 bg-gray-100';
  }
}

/**
 * Returns the icon name for a promise status
 * @param status Promise status
 * @returns Icon name for the status
 */
export function getPromiseStatusIcon(status: string): string {
  switch(status) {
    case 'Fulfilled':
      return 'check';
    case 'InProgress':
      return 'clock';
    case 'Unfulfilled':
      return 'x';
    default:
      return 'help-circle';
  }
}

/**
 * Format a number as a percentage
 * @param num Number to format as percentage
 * @returns Formatted percentage string
 */
export function formatPercentage(num: number): string {
  return `${num}%`;
}

/**
 * Truncate text with ellipsis if it exceeds maxLength
 * @param text Text to truncate
 * @param maxLength Maximum length before truncating
 * @returns Truncated text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Format a rating number to one decimal place
 * @param rating Rating number
 * @returns Formatted rating string
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Get a CSS class for a rating value
 * @param rating Rating value
 * @returns CSS class for the rating color
 */
export function getRatingColor(rating: number): string {
  if (rating >= 4) return 'text-green-600';
  if (rating >= 3) return 'text-amber-600';
  if (rating >= 2) return 'text-orange-600';
  return 'text-red-600';
}
