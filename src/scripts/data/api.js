import CONFIG from '../config';

const ENDPOINTS = {
  GET_ALL_STORIES: `${CONFIG.BASE_URL}/stories`,
  POST_STORY: `${CONFIG.BASE_URL}/stories`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
};

export default ENDPOINTS;

export async function getData() {
  const fetchResponse = await fetch(ENDPOINTS.ENDPOINT);
  return await fetchResponse.json();
}