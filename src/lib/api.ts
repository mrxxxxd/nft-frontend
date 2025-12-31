// src/lib/api.ts - Corrected version for your working backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    // 1. Build the URL (your env var is correct, so this should work)
    const url = `${API_BASE_URL}${endpoint}`;
    
    // 2. Set default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      // 3. Make the fetch request
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // 4. Check if the response is OK
      if (!response.ok) {
        // Try to get a useful error message
        let errorDetail = `HTTP ${response.status}`;
        try {
          const errorBody = await response.text();
          if (errorBody) {
            // Try to parse as JSON, fall back to raw text
            try {
              const errorJson = JSON.parse(errorBody);
              errorDetail = errorJson.message || errorDetail;
            } catch {
              errorDetail = errorBody.substring(0, 100); // First 100 chars
            }
          }
        } catch {
          // If we can't read the body, use status text
          errorDetail = response.statusText || errorDetail;
        }
        throw new Error(`API request failed: ${errorDetail}`);
      }

      // 5. Parse and return the JSON data
      return await response.json();
      
    } catch (error: any) {
      console.error(`API call to ${url} failed:`, error.message);
      // Re-throw so the UI can show the error
      throw error;
    }
  },

  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
