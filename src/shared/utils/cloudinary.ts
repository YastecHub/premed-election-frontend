const VITE_API = (import.meta as any).env?.VITE_API_URL;
const API_BASE = VITE_API || 'https://premed-election-backend.onrender.com';
const API_URL = `${API_BASE.replace(/\/$/, '')}/api`;

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`${API_URL}/upload/image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};
