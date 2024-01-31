import {
    Outlet, useLocation, useNavigate
  } from "react-router-dom";
import { Button } from "./Components/Buttons/Buttons";
import './Layout.css'
import AuthComponent from "./AuthComponent";

export default function Layout({gamePath,statPath,mainPath,loginPath}:{gamePath:string,statPath:string,mainPath:string,loginPath:string}){
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
    const loginCallback=(event:any)=>{
      //Log out
      if(AuthComponent.isAuthenticated){
        event.preventDefault();
        AuthComponent.unAuthenticate(() => {
          navigate("/");
        });
      //Log in
      }else{
        navigate(loginPath);
      }
    };

    return <div>
      <Header gameCallback={gameCallback} statCallback={statCallback} mainCallback={mainCallback} loginCallback={loginCallback}/>
      <Outlet />
    </div>
  }

function Header({gameCallback,statCallback,mainCallback,loginCallback}:{gameCallback:any,statCallback:any,mainCallback:any,loginCallback:any}){
    return <div className="header">
        <img alt="SzachMaty" className="logo" onClick={mainCallback}/>
        <Button text="♞Graj" callback={gameCallback}/>
        <Button text="Statystyki" callback={statCallback}/>
        <Button text={AuthComponent.isAuthenticated ? "Wyloguj się":"Zaloguj się"} callback={loginCallback} type="loginButton"/>
    </div>
}