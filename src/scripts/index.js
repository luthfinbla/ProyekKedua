import '../styles/styles.css';
import App from '../scripts/pages/app.js';
import {
  requestNotificationPermission,
  getVapidKey,
  subscribeUserToPush,
} from '../scripts/utils/notification-helper.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App({
    navigationDrawer: document.querySelector('#navigationDrawer'),
    content: document.querySelector('#mainContent'),
    loader: document.querySelector('#mainLoader'),
  });

  app.init();
});

window.addEventListener('DOMContentLoaded', async () => {
  app.init();
  await initPush(); 
});

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const currentRoute = window.location.hash;
  const isAuthRoute = currentRoute === '#/login' || currentRoute === '#/regist';

  const content = document.querySelector('#main-content');
  const drawerButton = document.querySelector('#drawer-button');
  const navigationDrawer = document.querySelector('#navigation-drawer');
  const siteHeader = document.querySelector('#site-header');
  const siteFooter = document.querySelector('#site-footer');

  if (!content) {
    console.error('❌ #main-content tidak ditemukan di DOM');
    return;
  }

  if (!token && !isAuthRoute) {
    window.location.hash = '#/regist';
  }

  if (!token) {
    if (siteHeader) siteHeader.style.display = 'none';
    if (siteFooter) siteFooter.style.display = 'none';
    if (drawerButton) drawerButton.style.display = 'none';
    if (navigationDrawer) navigationDrawer.style.display = 'none';
  }



  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});

export function transitionHelper({ skipTransition = false, updateDOM }) {
  if (skipTransition || !document.startViewTransition) {
    const updateCallbackDone = Promise.resolve(updateDOM());
    return {
      ready: Promise.reject(Error('View transitions unsupported')),
      updateCallbackDone,
      finished: updateCallbackDone,
    };
  }

  return document.startViewTransition(updateDOM);
}

export function setupSkipToContent(element, mainContent) {
  element.addEventListener('click', (e) => {
    e.preventDefault();
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('✅ SW terdaftar:', reg))
      .catch((err) => console.error('❌ SW gagal:', err));
  });
}

async function initPush() {
  try {
    await requestNotificationPermission();
    await subscribeUserToPush();
  } catch (error) {
    console.error('Gagal setup push notification:', error);
  }
}

initPush();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(() => {
      console.log('✅ Service Worker berhasil didaftarkan');
      initPush();
    })
    .catch((error) => {
      console.error('❌ Gagal mendaftarkan Service Worker:', error);
    });
}