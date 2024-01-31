import React, { ReactNode } from 'react';
import logo from './logo.svg';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate
} from "react-router-dom";
import Layout from './Layout';
import './App.css'
import RegisterView from './Views/RegisterView/RegisterView';
import GameView from './Views/GameView/GameView';
import StatsView from './Views/StatisticsView/StatisticsView';
import AuthComponent from './AuthComponent';
import LoginView from './Views/LoginView/LoginView';


function App() {

  return(
  <div className='app'>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<Layout gamePath="/game" statPath="/statistic" mainPath='/main' loginPath='/login'/>}>
            <Route 
              path="game" 
              element={
                <ProtectedPath>
                  <GameView/>
                </ProtectedPath>
              } 
            />
            <Route 
              path="statistic" 
              element={
                <ProtectedPath>
                  <StatsView/>
                </ProtectedPath>
              } 
            />
            <Route path="register" Component={RegisterView}/>
            <Route path="login" Component={LoginView}/>
          </Route>
        </Routes>
      </BrowserRouter>
  </div>)
}

function ProtectedPath({ children }:{children:any}) {
  let location = useLocation();
  return AuthComponent.isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} />
  );
}

export default App;
