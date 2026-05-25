import type { CatalogResponse } from "@iskoolarship/types";

// Explicitly using the local IP address for Expo Go physical device testing
// Do not use 'localhost' as it points to the phone itself, not the computer running the backend.
const API_BASE_URL = "http://192.168.254.114:3000";

export async function fetchCatalog(): Promise<CatalogResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/catalog`);
    
    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if the server returned our structured error
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    return data as CatalogResponse;
  } catch (error) {
    console.error("Failed to fetch catalog from backend:", error);
    throw error;
  }
}
