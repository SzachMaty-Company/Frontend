import {
  BrowserRouter,
  Routes,
  Route,
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
import FriendsChat from './Components/FriendsChat/FriendsChat';
import SearchProfileView from "./Views/StatisticsView/SearchProfile";
import { GoogleOAuthProvider } from '@react-oauth/google';

const sampleGameData = {
    playerWhiteFigures: 'sprzeglo46',
    playerBlackFigures: 'cbra600',
    winner: { isWhite: true},
    timerSettings: '10 minutes',
    gameStart: '21:37',
    gameHistory: [
      "e4",
      "e4",
      "e4",
      "e4",
      "e4",
      "e4",
      "e4",
      "e4",
      "e4",
      "e4",
      "e4",
      "e4",
      "e4",
      "e4",
      "e4",
      "e4",
      "e4",
      "e4",
      "e4"
    ]
};

const clientId = "668259347625-iagkl0snappd94oms3td3hba2np64oj1.apps.googleusercontent.com";

function App() {
  AuthComponent.initialize();
  return(
  <div className='app'>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<Layout gamePath="/game/searching" statPath="/statistic" loginPath='/login' searchPath="search/users" />}>
            <Route 
              path="game/:gamecode" 
              element={
                <ProtectedPath>
                    <GameView/>
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
            <Route 
              path="search/users" 
              element={
                <ProtectedPath>
                  <SearchProfileView/>
                </ProtectedPath>
              } 
            />
            <Route path="login" Component={LoginView}/>
            <Route path="summary" Component={() => <GameSummaryView {...sampleGameData} />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <FriendsChat></FriendsChat>
      </GoogleOAuthProvider>
  </div>
  )
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
