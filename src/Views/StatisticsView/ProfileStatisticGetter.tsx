import ProfileStatistic from "./ProfileStatistic";
import json from "./UserProfile.json"

export default function GetProfileStatistic():ProfileStatistic{
    let profile=Object.assign(new ProfileStatistic(),json);
    console.log(profile);
    return profile;
}