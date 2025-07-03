import CONFIG from '../../scripts/config.js';

export async function getAllStories() {
  const token = localStorage.getItem('authToken');
  console.log('🔑 TOKEN:', token);

  const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
  });

  console.log('📡 STATUS:', response.status);

  if (!response.ok) {
    throw new Error('Gagal mengambil data cerita');
  }

  const result = await response.json();
  return result.listStory;
}

