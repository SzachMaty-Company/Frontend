import { useState, useEffect } from 'react';
import {
    Outlet, useLocation, useNavigate
  } from "react-router-dom";
import { Button } from "./Components/Buttons/Buttons";
import './Layout.css'
import AuthComponent from "./AuthComponent";
import { AddFriend, FriendRequests, AcceptFriendRequest } from './ApiHelpers/UserServiceClient';

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
    });
  }, [cnt]);

  const AddFriendCallback=async ()=>{
    await AcceptFriendRequest(friendId);
    //Reload
    setCnt(0);
    setShowPopup(false);
  };
  return <>
      <Header gameCallback={gameCallback} statCallback={statCallback} loginCallback={loginCallback} searchCallback={searchCallback}/>
      <Outlet />
    </>
}