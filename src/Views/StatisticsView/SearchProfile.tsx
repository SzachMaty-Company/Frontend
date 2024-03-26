import { useState,FormEvent } from "react";
import { MainActionButton } from "../../Components/ActionButtons/ActionButtons";
import ContentWrapper from "../ContentWrapper";
import { SearchFriend } from "./ProfileStatisticGetter";
import { useNavigate } from "react-router-dom";
import "./StatisticsView.css"

export default function SearchProfileView() {
    let navigate = useNavigate();
    const [error, setError] = useState("");
    let [email,setEmail]=useState("");

    const handleSearch=(e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        SearchFriend(email).then((p)=>{
            if(p==null){
                setError("Nie znaleziono takiego profilu!");
            }else{
                navigate(`/statistic/${p.name}`, {
                    state: { userId: p.id }
                });
            }
        });
    }


    return <ContentWrapper isCentered={true}>
        <form onSubmit={handleSearch}>
            <table className="SearchProfileTable">
                <tr>
                    <td colSpan={2}>
                        <h1>Szukaj profilu</h1>
                    </td>
                </tr>
                {error !== "" &&
                    <tr className="errorRow">
                        <td colSpan={2}>
                            {error}
                        </td>
                    </tr>
                }
                <tr>
                    <td>Email</td>
                    <td>
                        <input type="text" name="email" onChange={(e) => setEmail(e.target.value)}></input>
                    </td>
                </tr>

                <tr>
                    <td colSpan={2}><MainActionButton text="Szukaj"></MainActionButton></td>
                </tr>
            </table>
        </form>
    </ContentWrapper>;
}