import { getAllStories } from '../model/story-model';
import { uploadStory } from '../model/addstory-model';
import CONFIG from '../config';
import IdbHelper from '../utils/idb';

import {
  bindFormSubmit,
  renderStoryList,
  showError,
  initCamera,
  initMapInput,
  renderStoryMap,
} from '../view/story-view';

class StoryPresenter {
    constructor({ view, getAllStories }) {
    this.bindFormSubmit = view.bindFormSubmit;
    this.initCamera = view.initCamera;
    this.initMapInput = view.initMapInput;
    this.renderStoryList = view.renderStoryList;
    this.showError = view.showError;
    this.getAllStories = getAllStories;
    this.view = view;
    this.getAllStories = getAllStories;
    }

    async init() {
    this.bindFormSubmit(this.handleSubmit.bind(this));

    this.initCamera({
      width: 320,
      onCapture: (imageDataUrl) => {
        this.capturedImage = imageDataUrl;
      },
    });

      this.initMapInput(({ lat, lng }) => {
        this.selectedLat = lat;
        this.selectedLon = lng;
      });

      await this.loadStories();
      try {
        const stories = await this.getAllStories();

        stories.forEach((story) => {
          IdbHelper.putStory(story);
        });

        this.view.renderStoryList(stories);
      } catch (error) {
        console.error('Gagal ambil dari API, ambil dari IndexedDB:', error);

        const offlineStories = await IdbHelper.getAllStories();
        this.view.renderStoryList(offlineStories);
      }
    }

    async deleteStory(id) {
      await IdbHelper.deleteStory(id);
      const updatedStories = await IdbHelper.getAllStories();
      this.view.renderStoryList(updatedStories);
    }

    async handleSubmit(description) {
      try {
        await uploadStory({
          description,
          photo: this.capturedImage,
          lat: this.selectedLat,
          lon: this.selectedLon,
        });

        await this.loadStories();
      } catch (error) {
        showError('Gagal mengunggah cerita');
      }
    }

    async loadStories() {
    try {
      const stories = await this.getAllStories();
      console.log('✅ Stories fetched:', stories);

      if (!stories || stories.length === 0) {
        showError('Tidak ada cerita ditemukan.');
        return;
      }

      renderStoryList(stories);
      renderStoryMap(stories);
    } catch (error) {
      console.error('❌ Gagal memuat cerita:', error);
      showError('Gagal memuat cerita');
    }
  }
}

export default StoryPresenter;

