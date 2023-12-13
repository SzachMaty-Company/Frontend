import React from 'react';
import logo from './logo.svg';

import {MainActionButton, SecondaryActionButton} from './Components/ActionButtons/ActionButtons.js';
import ChessBoard from './Components/ChessBoard/ChessBoard';

function App() {
  /*return <>
    <MainActionButton text="siema"></MainActionButton>
    <SecondaryActionButton text="enelo energy warzywoza"></SecondaryActionButton>
  </>;*/
  return <ChessBoard></ChessBoard>
}

export default App;
