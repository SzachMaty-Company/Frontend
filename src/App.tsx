import React, { ReactNode } from 'react';
import logo from './logo.svg';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation
} from "react-router-dom";
import Layout from './Layout';
import './App.css'
import RegisterView from './Views/RegisterView/RegisterView';
import GameView from './Views/GameView/GameView';
import StatsView from './Views/StatisticsView/StatisticsView';


function App() {

  return(
  <div className='app'>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<Layout gamePath="/game" statPath="/statistic" mainPath='/main'/>}>
            <Route path="game" Component={GameView}/>
            <Route path="statistic" Component={StatsView}/>
            <Route path="register" Component={RegisterView}/>
          </Route>
        </Routes>
      </BrowserRouter>
  </div>)
}

export default App;
