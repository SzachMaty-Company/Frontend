import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthComponent from "../../AuthComponent";

export default function LoginView() {
    const mes1 = "Username ";
    const mes2 = "Password ";
    let navigate = useNavigate();
    let location = useLocation();
  
    let [messageLogin, setLoginMessage] = useState("");

    const registerCallback=()=>{
        navigate("/register")
    }
  
    const handleSubmit = (event:any) => {
      event.preventDefault();
      let data:FormData = new FormData(event.currentTarget);
  
      AuthComponent.authenticate(data.get("user") as string, data.get("password") as string, (status:any) => {
        console.log(status);
        if (status === "Success") {
          if (location?.state?.from) navigate(location.state.from);
          else navigate("/");
        } else {
          setLoginMessage(status);
        }
      });
    };
    return (
      <div>
        Write user data
        <form onSubmit={handleSubmit}>
          {mes1}
          <input
            onChange={() => {
              setLoginMessage("");
            }}
            type="text"
            name="user"
          />
          <br />
          {mes2}
          <input
            onChange={() => {
              setLoginMessage("");
            }}
            type="password"
            name="password"
          />
          <br />
          <div style={{ color: "red" }}>{messageLogin}</div>
          <button type="submit">Log in</button>
        </form>
        <button onClick={registerCallback}>Register</button>
      </div>
    );
  }