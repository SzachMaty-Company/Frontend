import AuthComponent from "../AuthComponent";
import ProfileStatistic from "../Views/StatisticsView/ProfileStatistic";

export async function GetProfileStatistic(userId:number|undefined):Promise<ProfileStatistic>{

    console.log("User ID:");
    console.log(userId);
    
    let url=userId===undefined?`http://localhost:8000/user`:`http://localhost:8000/user?id=${userId}`;

    console.log("url:");
    console.log(url);

    let response = await fetch(url, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${AuthComponent.JSONToken}`,
            'Content-Type': 'application/json'}
        });
    console.log("#########################");
    console.log(response);
    console.log("#############################");

        
    let json:ProfileStatistic=await response.json();

    console.log("JSON token:");
    console.log(json);

    return json;
}

export async function GetFriends(userId:number|undefined):Promise<ProfileStatistic[]>{
    
    let url=userId===undefined?`http://localhost:8000/friend`:`http://localhost:8000/friend?id=${userId}`;

    let response = await fetch(url, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${AuthComponent.JSONToken}`,
            'Content-Type': 'application/json'}
        });

        
    let json:ProfileStatistic[]=await response.json();
    
    return json;
}

export async function AddFriend(userId:number) {
    let url=`http://localhost:8000/friend/${userId}/send`;

    let response = await fetch(url, {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${AuthComponent.JSONToken}`,
            'Content-Type': 'application/json'}
        });
}

export async function SearchFriend(email:string):Promise<ProfileStatistic|null> {
    let url=`http://localhost:8000/search/${email}`;

    let response = await fetch(url, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${AuthComponent.JSONToken}`,
            'Content-Type': 'application/json'}
        });

    
    let resp = await response;
    if(resp.status === 404) {
        return null;
    }
    let json:ProfileStatistic=await resp.json();

    console.log("JSON:");
    console.log(json);

    return json;
}

export async function FriendRequests():Promise<any|null> {
    let url=`http://localhost:8000/friend/request`;

    let response = await fetch(url, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${AuthComponent.JSONToken}`,
            'Content-Type': 'application/json'}
        });

    
    let resp = await response;
    if(resp.status === 404) {
        return null;
    }
    let json:any=await resp.json();

    console.log("JSON:");
    console.log(json);

    return json;
}

export async function AcceptFriendRequest(userId:number) {
    let url=`http://localhost:8000/friend/${userId}/accept`;

    let response = await fetch(url, {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${AuthComponent.JSONToken}`,
            'Content-Type': 'application/json'}
        });
}