const AddStoryView = {
  bindFormSubmit(callback) {
    const form = document.getElementById('storyForm');
    const descriptionInput = document.getElementById('description');
    if (form && descriptionInput) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        callback(descriptionInput.value);
      });
    }
  },

  initCamera({ width, onCapture }) {
  const video = document.getElementById('camera-video');
  const canvas = document.getElementById('camera-canvas');
  const button = document.getElementById('camera-take-button');
  const outputList = document.getElementById('camera-output-list');

  if (!video || !canvas || !button || !outputList) {
    console.warn('Elemen kamera belum tersedia');
    return;
  }

  const context = canvas.getContext('2d');
  let height = 0;
  let streaming = false;

  // Mulai streaming kamera
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((err) => console.error('Kamera gagal:', err));

  // Atur ukuran video & canvas saat kamera siap
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

  function takePicture() {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);
    const image = canvas.toDataURL('image/png');
    
    outputList.innerHTML = `<li><img src="${image}" alt="Hasil Kamera"/></li>`;

    return image;
  }

  button.addEventListener('click', () => {
    const image = takePicture();
    onCapture(image); 
  });
},


  initMapInput(callback) {
    const mapInput = document.getElementById('mapInput');
    if (!mapInput) return;

    const map = L.map(mapInput).setView([-2.5, 117], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    let marker;
    map.on('click', function (e) {
      const { lat, lng } = e.latlng;
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(map);
      }
      callback({ lat, lng });
    });
  },
};

export default AddStoryView;
