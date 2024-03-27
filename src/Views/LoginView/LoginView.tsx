import { useLocation, useNavigate } from "react-router-dom";
import AuthComponent from "../../AuthComponent";
import "./LoginView.css"
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginView() {
    let navigate = useNavigate();
    let location = useLocation();

    const GoogleLogin = useGoogleLogin({
      flow: 'auth-code',
      onSuccess: async codeResponse => {
          console.log("success")
          await fetch("http://localhost:8000/auth/google?code="+codeResponse.code)
              .then(data => {
                  return data.json()
              }).then(async data => {
                  AuthComponent.authenticate(data["token"]);
                  if (location?.state?.from) navigate(location.state.from);
                  else navigate("/");
              })
      },
      onError: errorResponse => console.log(errorResponse),
      redirect_uri: "http://localhost:3000"
    });

    return (
      <div>
        <table className="LoginTable">
          <tr>
            <td>
              <span>Logowanie</span>
            </td>
          </tr>
          <tr>
            <td>
              <img className="GoogleIcon" alt="Google auth" onClick={GoogleLogin}/>
            </td>
          </tr>
        </table>
      </div>
    );
  }