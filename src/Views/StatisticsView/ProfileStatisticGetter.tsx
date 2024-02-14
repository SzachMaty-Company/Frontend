import ProfileStatistic from "./ProfileStatistic";
import json from "./UserProfile.json"

export default function GetProfileStatistic(name:string|undefined):ProfileStatistic{
    let profiles:ProfileStatistic[]=Object.assign([],json);
    
    if(name!=null || name!=="user"){
        for(let i=0;i<profiles.length;i++)
            if(profiles[i].nickname===name)
                return profiles[i];
        return profiles[0];
    }
    return profiles[0];
}