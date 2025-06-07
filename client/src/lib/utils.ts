import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }

  const num = Math.abs(value);
  
  // Handle decimal numbers with precision
  if (num < 1) {
    return value.toFixed(2);
  }
  
  // Less than 1K - show as is
  if (num < 1000) {
    return Math.floor(value).toString();
  }
  
  // 1K to 99.9K
  if (num < 100000) {
    const thousands = value / 1000;
    return thousands % 1 === 0 ? `${Math.floor(thousands)}K` : `${thousands.toFixed(1)}K`;
  }
  
  // 1L to 99.9L (Indian system: 1 Lakh = 100,000)
  if (num < 10000000) {
    const lakhs = value / 100000;
    return lakhs % 1 === 0 ? `${Math.floor(lakhs)}L` : `${lakhs.toFixed(1)}L`;
  }
  
  // 1Cr and above (Indian system: 1 Crore = 10,000,000)
  const crores = value / 10000000;
  return crores % 1 === 0 ? `${Math.floor(crores)}Cr` : `${crores.toFixed(1)}Cr`;
}

export function formatEngagement(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0%";
  }
  
  // For engagement rates, format the base number and add %
  const formatted = formatNumber(value);
  return `${formatted}%`;
}
