import '/src/styles/regist.css';
import CONFIG from '../config';
import ENDPOINTS from '../data/api.js'; 

export default class Regist {
  async render() {
    return `
      <div class="wrapper">
        <div class="title">
          Register Form
        </div>
        <form id="register-form">
          <div class="field">
            <input type="text" id="name" required>
            <label>Nama</label>
          </div>
          <div class="field">
            <input type="email" id="email" required>
            <label>Email Address</label>
          </div>
          <div class="field">
            <input type="password" id="password" required>
            <label>Password</label>
          </div>
          <div class="field">
            <input type="submit" value="Register">
          </div>
          <div class="signup-link">
            Already have an account? <a href="#/login">Login here</a>
          </div>
          <div id="register-error" style="color:red; margin-top:1rem;"></div>
        </form>
      </div>
    `;
  }

  async afterRender() {
    const form = document.getElementById('register-form');
    const errorContainer = document.getElementById('register-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch(ENDPOINTS.REGISTER, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          errorContainer.textContent = errorData.message || 'Pendaftaran gagal';
          return;
        }

        window.location.hash = '#/login';
      } catch (err) {
        errorContainer.textContent = 'Terjadi kesalahan saat menghubungi server';
        console.error(err);
      }
    });
    
  }
}
