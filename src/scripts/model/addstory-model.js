import CONFIG from '../config';

export async function uploadStory({ image, description, lat, lon }) {
  const token = localStorage.getItem('authToken');

  const formData = new FormData();
  formData.append('photo', dataURItoBlob(image));
  formData.append('description', description);
  formData.append('lat', lat);
  formData.append('lon', lon);

  const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`
    },
    body: formData,
  });

  const data = await response.json();
  return data;
}

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
