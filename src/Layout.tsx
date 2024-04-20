import { useState, useEffect } from 'react';
import {
    Outlet, useLocation, useNavigate
  } from "react-router-dom";
import { Button } from "./Components/Buttons/Buttons";
import './Layout.css'
import AuthComponent from "./AuthComponent";
import { AddFriend, FriendRequests, AcceptFriendRequest } from './ApiHelpers/UserServiceClient';
import Popup from 'reactjs-popup';

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
    } else {
      navigate(loginPath);
    }
  };

  return <div>
    <Header gameCallback={gameCallback} statCallback={statCallback} loginCallback={loginCallback} searchCallback={searchCallback} />
    <Outlet />
  </div>
}

function Header({ gameCallback, statCallback, loginCallback, searchCallback }: { gameCallback: any, statCallback: any, loginCallback: any, searchCallback: any }) {
  let [cnt, setCnt] = useState(0);
  let [gotFriendRequest, setGotFriendRequest] = useState(false);
  let [friendId,setFriendId]=useState(-1);
  let [showPopup,setShowPopup] = useState(false);
  let [popupInfo,setPopupInfo] = useState([]as string[]);
  //Pętla sprawdzania
  useEffect(() => {
    const intervalFiendRequest = setTimeout(async () => {
      if (AuthComponent.isAuthenticated) {
        let friends=await FriendRequests();
        console.log(friends)
        if(friends.length == 0){
          setGotFriendRequest(false);
        }else if(friends[0]!==friendId){
          let friend=friends[0];
          setPopupInfo([friend.name,friend.surname]);
          setFriendId(friend.id);
          setGotFriendRequest(true);
        }
      }
      setCnt(cnt + 1);
    }, 5000);
      return () => {
        clearTimeout(intervalFiendRequest);
      };
    }, [cnt])

  const AddFriendCallback=async ()=>{
    await AcceptFriendRequest(friendId);
    //Reload
    setCnt(0);
    setShowPopup(false);
  };
  
  return <div className="header">
    <FriendPopup popupInfo={popupInfo} open={showPopup} callback={AddFriendCallback}/>
    <img alt="SzachMaty" className="logo" />
    <Button text="Graj" horse={true} callback={gameCallback} />
    <Button text="Statystyki" callback={statCallback} />
    <Button text="Szukaj profilu" callback={searchCallback} />
    {gotFriendRequest ?
      <Button text="!" callback={()=>setShowPopup(true)} /> :
      <></>
    }
    <Button text={AuthComponent.isAuthenticated ? "Wyloguj się" : "Zaloguj się"} callback={loginCallback} type="loginButton" />
  </div>
}

function FriendPopup({popupInfo,open,callback}:{popupInfo:string[],open:boolean,callback:any}) {

  return (
    <div>
      <Popup open={open} modal nested>
        <div className="PopUp friend">
          <p>Otrzymałeś zaproszenie do znajomych</p>
          <p>od {popupInfo[0]} {popupInfo[1]}</p>
          <button onClick={callback}>Zaakceptuj</button>
        </div>
      </Popup>
    </div>
  );
}