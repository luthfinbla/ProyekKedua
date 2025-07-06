
export function bindFormSubmit(handler) {
  const form = document.getElementById('storyForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const description = document.getElementById('description').value;
      await handler(description);
    });
  }
}

let mapInstance = null;

export function renderStoryMap(stories) {
  const mapContainer = document.getElementById('mapDisplay');
  if (!mapContainer) return;

  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  mapInstance = L.map(mapContainer).setView([-2.5, 117], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(mapInstance);

  stories.forEach((story) => {
    if (story.lat && story.lon) {
      const marker = L.marker([story.lat, story.lon]).addTo(mapInstance);
      marker.bindPopup(`<strong>${story.name}</strong><br>${story.description}<br>${story.createdAt}`);
    }
  });
}

export function initCamera({ width, onCapture }) {
  const video = document.getElementById('camera-video');
  const canvas = document.getElementById('camera-canvas');
  const button = document.getElementById('camera-take-button');

  if (!canvas || !video || !button) {
    console.warn('Elemen kamera belum tersedia, setupCamera dibatalkan');
    return;
  }

  const context = canvas.getContext('2d');

  let height = 0;
  let streaming = false;

  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((err) => console.error("Kamera gagal:", err));

  video.addEventListener('canplay', () => {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width);
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  });

  button.addEventListener('click', () => {
    context.drawImage(video, 0, 0, width, height);
    const imageDataUrl = canvas.toDataURL('image/png');
    onCapture(imageDataUrl); // kirim ke presenter
  });
}

export function initMapInput(callback) {
  const mapInput = document.getElementById('mapInput');
  if (!mapInput) return;

  const map = L.map(mapInput).setView([-2.5, 117], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  let marker = null;
  map.on('click', function (e) {
    const { lat, lng } = e.latlng;
    if (marker) {
      marker.setLatLng([lat, lng]);
    } else {
      marker = L.marker([lat, lng]).addTo(map);
    }
    callback({ lat, lng });
  });
}

export function renderStoryList(stories) {
  const container = document.getElementById('storyList');
  if (!container) return;

  container.innerHTML = '';
  stories.forEach((story) => {
    const storyDiv = document.createElement('div');
    storyDiv.classList.add('story');

    const tanggal = story.createdAt
      ? new Date(story.createdAt).toLocaleDateString('id-ID')
      : 'Tanggal tidak tersedia';

    storyDiv.innerHTML = `
      <img src="${story.photoUrl}" alt="${story.name}" />
      <h3>${story.name}</h3>
      <p>${story.description}</p>
      <p><strong>Tanggal:</strong> ${tanggal}</p>
    `;
    container.appendChild(storyDiv);
  });

    stories.forEach((story) => {
    container.innerHTML += `
      <div class="story-card">
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <div id="save-story-${story.id}"></div>
      </div>
    `;
  });
}

export function renderStoryItem(story) {
  const storyDiv = document.createElement('div');
  storyDiv.classList.add('story');
  storyDiv.innerHTML = `
    <img src="${story.photoUrl}" alt="${story.name}" />
    <h3>${story.name}</h3>
    <p>${story.description}</p>
  `;
  return storyDiv;
}

export function showError(message) {
  const container = document.querySelector('#storyList'); // pastikan ID ini sesuai
  if (!container) return;
  container.innerHTML = `<p class="error">${message}</p>`;
}

export default {
  renderStoryList,
  renderStoryItem,
  showError,
  bindFormSubmit,
  initCamera,
  initMapInput,
};

function bindDeleteButton(callback) {
  document.querySelectorAll('.delete-button').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      callback(id);
    });
  });
}

export function renderSaveButton(story) {
  const container = document.getElementById(`save-story-${story.id}`);
  if (!container) return;

  container.innerHTML = `
    <button id="save-${story.id}" aria-label="Simpan story">❤️ Simpan Story</button>
  `;

  document.getElementById(`save-${story.id}`).addEventListener('click', async () => {
    if (typeof story === 'object') {
      await import('../model/bookmark-story').then(module => {
        module.saveStoryToBookmark(story);
      });
    }
  });
}