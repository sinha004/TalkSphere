import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId); // Clear the timeout if user keeps typing
    }
    timeoutId = setTimeout(() => {
      func(...args); // Call the function after the delay
    }, delay);
  };
};
