const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
