import React from "react";
import Popup from "reactjs-popup";
import './GameView.css'

export default function GamePopup({popupInfo,open}:{popupInfo:string[],open:boolean}) {
  return (
    <div>
      <Popup open={open} modal nested>
        <div className="PopUp">
          <p>{popupInfo[0]}</p>
          {popupInfo.length > 1 ?
            <p>{popupInfo[1]}</p>:
            <p></p>
          }
          <button>Przejdź do podsumowania</button>
        </div>
      </Popup>
    </div>
  );
}