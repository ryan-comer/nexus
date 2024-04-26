import logo from './logo.svg';
import './App.css';

import {HashRouter as Router, Route, Routes} from 'react-router-dom';

import HomePage from './pages/HomePage';
import BotsPage from './pages/BotsPage';
import MainBar from './components/MainBar';

import { Provider } from 'react-redux';
import store from './store';

import { ThemeProvider, createTheme } from '@mui/material';

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

const theme = createTheme({
  palette: {
    primary: {
      main: '#3c3c3c'
    },
    secondary: {
      main: '#009820'
    }
  }
})

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <MainBar routes={routes}/>
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.component()}/>
              ))}
            </Routes>
          </Router>
        </ThemeProvider>
      </Provider>
    </div>
  );
}

export default App;
