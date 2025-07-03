import '/src/styles/login.css';
import CONFIG from '../../scripts/config';

export default class Login {
  async render() {
    return `
      <div class="wrapper">
        <div class="title">Login Form</div>
        <form id="login-form">
          <div class="field">
            <input type="text" id="email" required />
            <label>Email Address</label>
          </div>
          <div class="field">
            <input type="password" id="password" required />
            <label>Password</label>
          </div>
          <div class="field">
            <input type="submit" value="Login" />
          </div>
        </form>
      </div>
    `;
  }

  async afterRender() {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch(`${CONFIG.BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log('Login response:', data);

        if (response.ok && data.loginResult && data.loginResult.token) {
          localStorage.setItem('authToken', data.loginResult.token);
          window.location.hash = '#/home'; 
        } else {
          alert(data.message || 'Login gagal');
        }
      } catch (err) {
        console.error('Login error:', err);
        alert('Terjadi kesalahan saat login');
      }
    });
  }
}
