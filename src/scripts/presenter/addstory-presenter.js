class AddStoryPresenter {
  constructor({ model, view }) {
    this.model = model;
    this.view = view;
    this.capturedImage = null;
    this.selectedLat = null;
    this.selectedLon = null;
  }

  init() {
    this.view.bindFormSubmit(this.handleSubmit.bind(this));
    this.view.initCamera({
      width: 320,
      onCapture: (image) => {
        this.capturedImage = image;
      },
    });
    this.view.initMapInput(({ lat, lng }) => {
      this.selectedLat = lat;
      this.selectedLon = lng;
    });
  }

  async handleSubmit(description) {
    if (!this.capturedImage) return alert('Ambil gambar dulu');
    if (!this.selectedLat || !this.selectedLon) return alert('Pilih lokasi di peta');

    const response = await this.model.uploadStory({
      image: this.capturedImage,
      description,
      lat: this.selectedLat,
      lon: this.selectedLon,
    });

    if (!response.error) {
      alert('Berhasil mengirim cerita!');
    } else {
      alert('Gagal: ' + response.message);
    }
  }
}

export default AddStoryPresenter;