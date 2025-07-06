import { openDB } from 'idb';

const DATABASE_NAME = 'berbagi-cerita-db';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'liked-stories';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
  },
});

const Database = {
  async putStory(story) {
    if (!story.id) throw new Error('`id` is required to save.');
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },
  async getStoryById(id) {
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },
  async deleteStory(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  }
};

export default Database;
