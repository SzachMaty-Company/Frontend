import { useLocation, useNavigate } from "react-router-dom";
import AuthComponent from "../../AuthComponent";
import "./LoginView.css"

export default function LoginView() {
    let navigate = useNavigate();
    let location = useLocation();

    const handleSubmit = (event:any) => {
      event.preventDefault();
      AuthComponent.authenticate("Admin", "Admin", (status:any) => {
        console.log(status);
        if (status === "Success") {
          if (location?.state?.from) navigate(location.state.from);
          else navigate("/");
        }
      });
    };
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
              <img className="GoogleIcon" alt="Google auth" onClick={handleSubmit}/>
            </td>
          </tr>
        </table>
      </div>
    );
  }