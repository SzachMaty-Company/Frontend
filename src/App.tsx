import React from 'react';
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


import {MainActionButton, SecondaryActionButton} from './Components/ActionButtons/ActionButtons.js';
import ChessBoard from './Components/ChessBoard/ChessBoard';

function App() {

  return(<div className='app'>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout gamePath="/game" statPath="/statistic" mainPath='/main'/>}>
          <Route
            path="game"
            element={
              <ChessBoard></ChessBoard>
            }
          />
          <Route
            path="statistic"
            element={
              <h2>Statistics</h2>
            }
          />
          <Route
            path="main"
            element={
              <h2>Hello traveler</h2>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>)
}

export default App;
