import React from "react";
import Popup from "reactjs-popup";
import './GameView.css'

export default function GamePopup() {
  let communicate = "Wygrałeś!";
  let player = "Grześ";
  let open = true;
  return (
    <div>
      <Popup open={open} modal nested>
        <div className="PopUp">
          <p>{communicate}</p>
          <p>Wygrał gracz {player}</p>
          <button>Przejdź do podsumowania</button>
        </div>
      </Popup>
    </div>
  );
}