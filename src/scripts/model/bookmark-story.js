import Database from '../data/database';

export async function saveStoryToBookmark(story) {
  try {
    await Database.putStory(story);
    alert('Story disimpan ke bookmark!');
  } catch (error) {
    alert('Gagal menyimpan story: ' + error.message);
  }
}

export async function getBookmarkedStories() {
  return await Database.getAllStories();
}

export async function deleteBookmarkedStory(id) {
  await Database.deleteStory(id);
}
