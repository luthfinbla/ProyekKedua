import { openDB } from 'idb';

const DB_NAME = 'berbagi-cerita-db';
const STORE_NAME = 'stories';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

const IdbHelper = {
  async getAllStories() {
    return (await dbPromise).getAll(STORE_NAME);
  },

  async getStory(id) {
    return (await dbPromise).get(STORE_NAME, id);
  },

  async putStory(story) {
    return (await dbPromise).put(STORE_NAME, story);
  },

  async deleteStory(id) {
    return (await dbPromise).delete(STORE_NAME, id);
  },

  async clearAll() {
    return (await dbPromise).clear(STORE_NAME);
  },
};

export default IdbHelper;
