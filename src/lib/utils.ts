import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getCharacterLimit(platform: string): number {
  switch (platform.toLowerCase()) {
    case 'twitter':
      return 280
    case 'linkedin':
      return 3000
    case 'facebook':
      return 63206
    case 'instagram':
      return 2200
    default:
      return 280
  }
}

export function extractHashtags(text: string): string[] {
  const regex = /#[\w]+/g
  const matches = text.match(regex)
  return matches ? matches.map(tag => tag.toLowerCase()) : []
}
