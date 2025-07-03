import StoryPresenter from '../../presenter/story-presenter';
import StoryView from '../../view/story-view';
import { getAllStories } from '../../model/story-model';

export default class HomePage {
  async render() {
    return `
      <a href="#main-content" class="skip-link">Lewati ke konten utama</a>

      <header id="site-header">
        <div class="main-header container">
          <a class="brand-name" href="#/">Berbagi Cerita</a>

          <nav id="navigation-drawer" class="navigation-drawer">
            <ul id="nav-list" class="nav-list">
              <li><a href="#/">Beranda</a></li>
              <li><a href="#/add">Tambah Cerita</a></li>
              <li><a href="#/about">Tentang</a></li>
            </ul>
          </nav>
          <button id="drawer-button" class="drawer-button">☰</button>
        </div>
      </header>

      <main id="main-content" tabindex="-1">
        <section>
          <h2>Daftar Cerita</h2>
          <div id="error-container" style="color: red; margin: 16px 0;"></div>
          <div id="storyList" class="story-container"></div>
        </section>

        <section>
          <h2>Peta Lokasi Cerita</h2>
          <div id="mapDisplay" style="height: 400px; margin-bottom: 40px;"></div>
        </section>
      </main>

      <footer id="site-footer">
        <p>&copy; 2025 Berbagi Cerita</p>
      </footer>
    `;
  }

  async afterRender() {
    const token = localStorage.getItem('token');

    // Tampilkan elemen-elemen UI jika token valid
    if (token) {
      const header = document.querySelector('#site-header');
      const footer = document.querySelector('#site-footer');
      const drawerBtn = document.querySelector('#drawer-button');
      const navDrawer = document.querySelector('#navigation-drawer');

      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
      if (drawerBtn) drawerBtn.style.display = '';
      if (navDrawer) navDrawer.style.display = '';
    }

    try {
      const presenter = new StoryPresenter({ view: StoryView, getAllStories });
      await presenter.init();
    } catch (error) {
      console.error('❌ Gagal menampilkan cerita:', error);
      const errorContainer = document.querySelector('#error-container');
      if (errorContainer) {
        errorContainer.textContent = 'Gagal memuat cerita. Silakan coba lagi.';
      }
    }
  }
}
