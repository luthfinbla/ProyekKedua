import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddStory from '../pages/addstory';
import Login from '../pages/login';
import Regist from '../pages/regist';

const routes = {
  '/home': () => new HomePage(),
  '/about': () => new AboutPage(),
  '/add': () => new AddStory(),
  '/login': () => new Login(),
  '/': () => new Regist(),
  '/regist': () => new Regist(),
};

export default routes;