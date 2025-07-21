import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getTokenExpiration(token: string): number {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.exp * 1000; // convert to milliseconds
}

export function isTokenExpired(token: string): boolean {
  return Date.now() > getTokenExpiration(token);
}