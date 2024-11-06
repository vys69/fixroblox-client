const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969';

export async function checkServerStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/ping`);
    return await response.text();
  } catch (error) {
    console.error('Error checking server status:', error);
    throw error;
  }
}
