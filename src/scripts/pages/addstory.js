import '/src/styles/styles.css';
import AddStoryView from '../view/addstory-view';
import { uploadStory } from '../model/addstory-model';

export default class AddStory {
  constructor() {
    this.capturedImage = null;
    this.selectedLat = null;
    this.selectedLon = null;
  }

  async render() {
    return `
      <section class="add-story">
        <h2>Tambah Cerita</h2>
        <form id="storyForm">
          <label for="description">Deskripsi:</label><br />
          <textarea id="description" placeholder="Tulis cerita kamu..." required></textarea><br />

          <div class="camera-section">
            <video id="camera-video" autoplay></video>
            <canvas id="camera-canvas" hidden></canvas>
            <button type="button" id="camera-take-button">Ambil Gambar</button>
            <ul id="camera-output-list"></ul>
          </div>

          <div id="mapInput" style="height: 300px; margin-top: 10px;"></div>

          <button type="submit">Kirim Cerita</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    AddStoryView.initCamera({
      width: 320,
      onCapture: (imageDataUrl) => {
        this.capturedImage = imageDataUrl;
      },
    });

    AddStoryView.initMapInput(({ lat, lng }) => {
      this.selectedLat = lat;
      this.selectedLon = lng;
    });

    // Binding form
    AddStoryView.bindFormSubmit(async (description) => {
      if (!this.capturedImage || this.selectedLat == null || this.selectedLon == null) {
        alert('Pastikan Anda sudah mengambil gambar dan memilih lokasi.');
        return;
      }

      try {
        const response = await uploadStory({
          image: this.capturedImage, 
          description,
          lat: this.selectedLat,
          lon: this.selectedLon,
        });

        console.log('Cerita berhasil dikirim:', response);
        window.location.hash = '#/home';
      } catch (error) {
        console.error('Gagal mengirim cerita:', error);
        alert('Gagal mengirim cerita. Coba lagi.');
      }
    });
  }
}
