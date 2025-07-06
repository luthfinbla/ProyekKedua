import { getBookmarkedStories, deleteBookmarkedStory } from '../../model/bookmark-story';

export default class BookmarkPage {
  async render() {
    return `
      <section class="container">
        <h2>Story yang Disukai</h2>
        <div id="bookmarked-story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    const container = document.getElementById('bookmarked-story-list');
    const stories = await getBookmarkedStories();

    if (stories.length === 0) {
      container.innerHTML = '<p>Tidak ada story yang disimpan.</p>';
      return;
    }

    container.innerHTML = stories.map(story => `
      <div class="story-card">
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <button aria-label="Hapus dari bookmark" data-id="${story.id}">Hapus</button>
      </div>
    `).join('');

    container.querySelectorAll('button[data-id]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        await deleteBookmarkedStory(id);
        this.afterRender(); // Refresh list
      });
    });
  }
}
