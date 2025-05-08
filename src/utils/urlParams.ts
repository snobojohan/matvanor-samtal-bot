/**
 * Get a URL parameter value by name
 * @param name The parameter name to retrieve
 * @param defaultValue Optional default value if parameter is not present
 * @returns The parameter value or the default value
 */
export const getUrlParameter = (name: string, defaultValue: string = ''): string => {
  if (typeof window === 'undefined') return defaultValue;
  
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || defaultValue;
}; 