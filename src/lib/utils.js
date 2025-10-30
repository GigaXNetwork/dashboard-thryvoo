// /**
//  * Combines class names using clsx and merges Tailwind classes with tailwind-merge
//  * @param {...ClassValue} inputs - Class names or class name objects/arrays
//  * @returns {string} - Merged and optimized class string
//  */
// export function cn(...inputs) {
//   // First resolve class names with clsx
//   const resolvedClasses = clsx(inputs);
  
//   // Then merge Tailwind classes with tailwind-merge
//   return twMerge(resolvedClasses);
// }



import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and merges Tailwind classes with tailwind-merge.
 * This ensures conditional class names and Tailwind overrides work correctly.
 *
 * @param {...any} inputs - Class names, arrays, or objects.
 * @returns {string} - Merged and optimized class string.
 */
export function cn(...inputs) {
  // First resolve class names with clsx
  const resolvedClasses = clsx(inputs)
  
  // Then merge Tailwind classes with tailwind-merge
  return twMerge(resolvedClasses)
}
