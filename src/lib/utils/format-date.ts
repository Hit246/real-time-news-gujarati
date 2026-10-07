export function formatDate(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('gu-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}

export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('gu-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return '';
  }
}

export function formatTimeAgo(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'હમણાં જ';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} મિનિટ પહેલાં`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} કલાક પહેલાં`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} દિવસ પહેલાં`;

    return formatDate(dateString);
  } catch {
    return '';
  }
}
