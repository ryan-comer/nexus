import logo from './logo.svg';
import './App.css';

import {HashRouter as Router, Route, Routes} from 'react-router-dom';

import HomePage from './pages/HomePage';
import BotsPage from './pages/BotsPage';
import MainBar from './components/MainBar';

import { Provider } from 'react-redux';
import store from './store';

const routes = [
  {
    path: "/",
    component: () => <HomePage/>,
    name: "Home"
  },
  {
    path: "/bots",
    component: () => <BotsPage/>,
    name: "Bots"
  }
]

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <MainBar routes={routes}/>
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.component()}/>
            ))}
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
