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
import GameView from './Views/GameView/GameView';
import StatsView from './Views/StatisticsView/StatisticsView';
import AuthComponent from './AuthComponent';
import LoginView from './Views/LoginView/LoginView';
import SearchGameView from './Views/GameView/SearchGame';
import GameStatus from './Views/GameView/GameStatus';
import GameSummaryView from './Views/GameSummaryView/GameSummaryView';

const sampleGameData = {
    playerWhiteFigures: 'sprzeglo46',
    playerBlackFigures: 'cbra600',
    winner: { isWhite: true},
    timerSettings: '10 minutes',
    gameStart: '21:37',
    gameHistory: [
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
        { doneBy: { isWhite: true }, figure: 'Pawn', position: 'e2', moveTo:'e4' },
      
    ]
};


function App() {

  return(
  <div className='app'>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<Layout gamePath="/game" statPath="/statistic" loginPath='/login'/>}>
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
            <Route 
              path="statistic" 
              element={
                <ProtectedPath>
                  <StatsView/>
                </ProtectedPath>
              } 
            />
            <Route path="login" Component={LoginView}/>
            <Route path="summary" Component={() => <GameSummaryView {...sampleGameData} />} />
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
