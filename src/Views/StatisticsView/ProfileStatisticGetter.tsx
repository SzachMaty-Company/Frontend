import AuthComponent from "../../AuthComponent";
import ProfileStatistic from "./ProfileStatistic";

export default async function GetProfileStatistic(userId:number|undefined):Promise<ProfileStatistic>{
    
    let response = await fetch(`http://localhost:5000/statistics/user?id=${userId}`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${AuthComponent.JSONToken}`,
            'Content-Type': 'application/json'}
        });

    let json:string=await response.json();

    let profile:ProfileStatistic=JSON.parse(json);

    return profile;
}