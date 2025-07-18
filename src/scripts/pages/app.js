// src/scripts/pages/app.js
import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { setupSkipToContent } from '../utils';

export default class App {
  #content;
  #drawerButton;
  #navigationDrawer;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#navigationDrawer = navigationDrawer;
    this.#drawerButton = drawerButton;
    this.#content = content;
  }

  init() {
    this._setupDrawer();
    this._setupSkipLink();
    this.renderPage(); // panggil halaman saat init
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  _setupSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.querySelector('#main-content');
    if (skipLink && mainContent) {
      setupSkipToContent(skipLink, mainContent);
    }
  }

  setupNavigationList() {
    const navList = document.querySelector('#nav-list');
    if (!navList) return;

    const isLoggedIn = !!localStorage.getItem('token');
    navList.innerHTML = `
      <li><a href="#/home">Beranda</a></li>
      <li><a href="#/add">Tambah Cerita</a></li>
      <li><a href="#/about">Tentang</a></li>
      ${isLoggedIn
        ? '<li><a href="#/logout">Keluar</a></li>'
        : '<li><a href="#/login">Masuk</a></li>'}
    `;
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];

    const page = route();

    if (!document.startViewTransition) {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      return;
    }

    const transition = document.startViewTransition(async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    });

    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: 'instant' });
      this.setupNavigationList();
    });
  }
}
