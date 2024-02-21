import React, { ReactNode } from 'react';
import logo from './logo.svg';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
  useParams
} from "react-router-dom";
import Layout from './Layout';
import './App.css'
import RegisterView from './Views/RegisterView/RegisterView';
import GameView from './Views/GameView/GameView';
import StatsView from './Views/StatisticsView/StatisticsView';
import AuthComponent from './AuthComponent';
import LoginView from './Views/LoginView/LoginView';
import SearchGameView from './Views/GameView/SearchGame';
import GameStatus from './Views/GameView/GameStatus';


function App() {

  return(
  <div className='app'>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<Layout gamePath="/game" statPath="/statistic/user" mainPath='/main' loginPath='/login'/>}>
            <Route 
              path="game" 
              element={
                <ProtectedPath>
                  <GamePath>
                    <GameView/>
                  </GamePath>
                </ProtectedPath>
              } 
            />
            <Route 
              path="game/searching" 
              element={
                <ProtectedPath>
                  <SearchGameView/>
                </ProtectedPath>
              } 
            />
            <Route 
              path="statistic/:name" 
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
  console.log("Params Protected:")
  console.log(useParams())
  return AuthComponent.isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} />
  );
}

function GamePath({ children }:{children:any}){
  let location = useLocation();
  return GameStatus.gameFound ? (
    children
  ) : (
    <Navigate to="/game/searching" state={{ from: location.pathname }} />
  );
}

export default App;
