import {
    Outlet, useLocation, useNavigate
  } from "react-router-dom";
import { Button } from "./Components/Buttons/Buttons";
import './Layout.css'
import AuthComponent from "./AuthComponent";

export default function Layout({gamePath,statPath,loginPath,searchPath}:{gamePath:string,statPath:string,loginPath:string,searchPath:string}){
    const navigate = useNavigate();
    const gameCallback=()=>{
        navigate(gamePath);
    };
    const statCallback=()=>{
        navigate(statPath);
    };
    const searchCallback=()=>{
      navigate(searchPath);
  };
    const loginCallback=(event:any)=>{
      //Log out
      if(AuthComponent.isAuthenticated){
        event.preventDefault();
        AuthComponent.unAuthenticate();
        navigate("/");
      //Log in
      }else{
        navigate(loginPath);
      }
    };

    return <div>
      <Header gameCallback={gameCallback} statCallback={statCallback} loginCallback={loginCallback} searchCallback={searchCallback}/>
      <Outlet />
    </div>
  }

function Header({gameCallback,statCallback,loginCallback,searchCallback}:{gameCallback:any,statCallback:any,loginCallback:any,searchCallback:any}){
    return <div className="header">
        <img alt="SzachMaty" className="logo"/>
        <Button text="Graj" horse={true} callback={gameCallback}/>
        <Button text="Statystyki" callback={statCallback}/>
        <Button text="Szukaj profilu" callback={searchCallback}/>
        <Button text={AuthComponent.isAuthenticated ? "Wyloguj się":"Zaloguj się"} callback={loginCallback} type="loginButton"/>
    </div>
}