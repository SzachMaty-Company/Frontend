import React from "react";
import Popup from "reactjs-popup";
import './GameView.css'
import { useNavigate } from "react-router-dom";

export default function GamePopup({popupInfo,open}:{popupInfo:string[],open:boolean}) {
  let navigate = useNavigate();
  const callback=()=>{
    navigate("/");
  }

  return (
    <div>
      <Popup open={open} modal nested>
        <div className="PopUp">
          <p>{popupInfo[0]}</p>
          {popupInfo.length > 1 ?
            <p>{popupInfo[1]}</p>:
            <p></p>
          }
          <button onClick={callback}>Przejdź do strony głównej</button>
        </div>
      </Popup>
    </div>
  );
}