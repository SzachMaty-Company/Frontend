import {
    Outlet, useLocation, useNavigate
  } from "react-router-dom";
import { Button } from "./Components/Buttons/Buttons";
import './Layout.css'

export default function Layout({gamePath,statPath,mainPath}:{gamePath:string,statPath:string,mainPath:string}){
    const navigate = useNavigate();
    const gameCallback=()=>{
        navigate(gamePath);
    };
    const statCallback=()=>{
        navigate(statPath);
    };
    const mainCallback=()=>{
        navigate(mainPath);
    };

    return <div>
      <Header gameCallback={gameCallback} statCallback={statCallback} mainCallback={mainCallback}/>
      <Outlet />
    </div>
  }

function Header({gameCallback,statCallback,mainCallback}:{gameCallback:any,statCallback:any,mainCallback:any}){
    return <div className="header">
        <img className="logo" onClick={mainCallback}/>
        <Button text="♞Graj" callback={gameCallback}/>
        <Button text="Statystyki" callback={statCallback}/>
    </div>
}