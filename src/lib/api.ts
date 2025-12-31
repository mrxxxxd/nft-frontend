// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * A robust API client for making HTTP requests.
 * Handles errors consistently and logs for debugging.
 */
export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    // 1. Construct the FULL URL
    const url = `${API_BASE_URL}${endpoint}`;
    
    // (Optional) Log for debugging - remove in production
    console.log(`[apiClient] Fetching: ${url}`);

    try {
      // 2. Make the network request
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      // 3. Log the raw response status
      console.log(`[apiClient] Response Status: ${response.status} ${response.statusText}`);

      // 4. Check if the response is OK (status 200-299)
      if (!response.ok) {
        // Try to get error message from response body
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response isn't JSON, use status text
        }
        console.error(`[apiClient] ${errorMessage} for ${url}`);
        throw new Error(errorMessage);
      }

      // 5. Parse and return successful JSON response
      return await response.json();
      
    } catch (error: any) {
      // 6. Handle network errors or re-throw API errors
      console.error(`[apiClient] Network/Fetch error for ${url}:`, error.message);
      // Re-throw the error so the component can catch it
      throw error;
    }
  },

  // Convenience methods
  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};
