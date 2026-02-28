/**
 * Utility functions for NetListLab
 */

/**
 * Format large numbers to human-readable format
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Format date to human-readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffMonths = Math.floor(diffMs / 2592000000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;

  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if value is within responsive breakpoints
 */
export const breakpoints = {
  xs: 480,
  sm: 640,
  md: 1024,
  lg: 1440,
  xl: 1920,
} as const;

/**
 * Parse difficulty color
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return '#00E87A';
    case 'intermediate':
      return '#00C8F0';
    case 'advanced':
      return '#F5A623';
    case 'expert':
      return '#F43F5E';
    default:
      return '#94A3B8';
  }
}

/**
 * Parse domain color
 */
export function getDomainColor(domain: string): string {
  const domainMap: Record<string, string> = {
    electronics: '#00C8F0',
    software: '#3B6EF0',
    mechanical: '#F5A623',
    design: '#F43F5E',
    aiml: '#8B5CF6',
    robotics: '#00E87A',
    research: '#94A3B8',
  };
  return domainMap[domain.toLowerCase()] || '#94A3B8';
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Merge classes conditionally
 */
export function cx(...classes: (string | boolean | undefined | null)[]): string {
  return classes
    .filter((cls) => typeof cls === 'string' && cls.length > 0)
    .join(' ');
}
