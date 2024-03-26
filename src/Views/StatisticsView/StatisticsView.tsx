import {useEffect, useState } from 'react';
import ContentWrapper from '../ContentWrapper';
import GetProfileStatistic, { AddFriend, GetFriends } from './ProfileStatisticGetter';
import "./StatisticsView.css"
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import GameSummaryHistory from '../GameSummaryView/GameSummaryHistory';
import ProfileStatistic, { Match } from './ProfileStatistic';
import AuthComponent from '../../AuthComponent';

export default function StatsView() {
    let navigate = useNavigate();

    const { state } = useLocation();
    const { name } = useParams();
 
    const [userId, setUserId] = useState(!state?undefined:state.userId);
    let [profile, setProfile] = useState(new ProfileStatistic());
    let [selectedMatch, setSelectedMatch] = useState(-1);
    let [friends, setFriends] = useState([] as ProfileStatistic[]);
    let [isAddedToFriends, setIsAddedToFriends] = useState(false);
    let [selectedFriend, setSelectedFriend] = useState(0);
    let [selectedFriendName, setSelectedFriendName] = useState("");

    const changeFriend = (event: any) => {
        let id = 0;
        for (let i = 0; i < friends.length; i++) {
            if (friends[i].name === event.target.value) {
                id = i;
                break;
            }
        }
        setSelectedFriend(id);
        setSelectedFriendName(friends[id].name);
    };

    const matchClicked = (id: number) => {
        setSelectedMatch(id);
    };

    const friendClicked = (friend: ProfileStatistic) => {
        navigate(`/statistic/${friend.name}`, {
            state: { userId: friend.id }
        });
    };

    const addFriend = () => {
        AddFriend(profile.id).then();
        setIsAddedToFriends(true);
    };

    useEffect(() => {
        setUserId(!state?undefined:state.userId);
    }, [name,state]);

    useEffect(() => {
        GetProfileStatistic(userId).then(
            p => {
                setProfile(p);
            }
        );
        GetFriends(userId).then(
            p => {
                setFriends(p);
                if (p.length !== 0) {
                    setSelectedFriendName(p[0].name);
                }
            }
        );
    }, [userId]);

    useEffect(()=>{
        if (profile.email=== AuthComponent.UserMail) {
            setIsAddedToFriends(true);
        } else {
            let len = friends.length;
            let i = 0;
            for (; i < len; i++) {
                if (friends[i].email === AuthComponent.UserMail)
                    break;
            }
            setIsAddedToFriends(i !== len);
        }
    },[friends,name,profile.email,userId])

    return <ContentWrapper isCentered={false}>
        {profile.name === "" ?
            <p></p> :
            <div>
                <table className='StatisticsTable'>
                    <tr>
                        <td className='ProfileNameTd'>
                            <h1 className='ProfileName'>{profile.name}</h1>{isAddedToFriends ? <span></span> : <span className='AddToFriends' onClick={addFriend}>(<span>dodaj do znajomych</span>)</span>}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h2 className='LabelHeader'>Informacje:</h2>
                        </td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Imię</td>
                        <td>{profile.name}</td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Nazwisko</td>
                        <td>{profile.surname}</td>
                    </tr>
                    <tr>
                        <td>
                            <h2 className='LabelHeader'>Statystyki:</h2>
                        </td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Wsp. Zwycięstw (AI)</td>
                        <td>{profile.statistics.winrateAI * 100}%</td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Zwycięstwa (AI)</td>
                        <td>{profile.statistics.winAI}</td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Rozegrane gry (AI)</td>
                        <td>{profile.statistics.playAI}</td>
                    </tr>

                    <tr className='FormRecord'>
                        <td className='LabelTag'>Wsp. Zwycięstw (Znajomi)</td>
                        <td>{profile.statistics.winrateFriends * 100}%</td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Zwycięstwa (Znajomi)</td>
                        <td>{profile.statistics.winFriends}</td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Rozegrane gry (Znajomi)</td>
                        <td>{profile.statistics.playFriends}</td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Wybierz znajomego</td>
                        <td>
                            <select value={selectedFriendName}
                                onChange={(e) => changeFriend(e)}>
                                {friends.map((friend: ProfileStatistic,index:number) =>
                                    <option key={index} value={friend.name}>{friend.name}</option>
                                )}
                            </select>
                        </td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Wsp. Zwycięstw</td>
                        <td>{friends[selectedFriend]?.winrateAgainst}</td>
                    </tr>
                    <tr>
                        <td>
                            <h2 className='LabelHeader'>Znajomi:</h2>
                        </td>
                    </tr>
                    {friends.map((friend: ProfileStatistic, i: number) => (
                        <tr key={i} className='FormRecord'>
                            <td className='LabelTag' onClick={() => (friendClicked(friend))}><span className='friend'>{friend.name}</span></td>
                        </tr>
                    ))}
                </table>
                {!(name == null) || profile.statistics.games == null ? <br /> :
                    <div className='GameHistoryDiv'>
                        <table>
                            <tr>
                                <td>
                                    <h2 className='LabelHeader'>Historia gier:</h2>
                                </td>
                            </tr>
                        </table>
                        <table className='GameHistoryTable'>
                            <tr className='GameHistoryHeader'>
                                <td className='LabelTag'>Białe</td>
                                <td className='LabelTag'>Czarne</td>
                                <td className='LabelTag'>Wygrał</td>
                                <td className='LabelTag'>Tryb gry</td>
                                <td className='LabelTag'>Data</td>
                            </tr>
                            {profile.statistics.games.map((match: Match, i: number) => (
                                <tr key={i} className={selectedMatch === i ? 'GameHistory Selected' : 'GameHistory'} onClick={() => (matchClicked(i))}>
                                    <td className='LabelValue'>{match.white}</td>
                                    <td className='LabelValue'>{match.black}</td>
                                    <td className='LabelValue'>{match.win}</td>
                                    <td className='LabelValue Mode'>{match.mode}</td>
                                    <td className='LabelValue Date'>{new Date(match.date).toLocaleString()}</td>
                                </tr>
                            ))}
                        </table>{
                            selectedMatch !== -1 ?
                                <GameSummaryHistory title='Historia partii:' gameHistory={profile.statistics.games[selectedMatch].moves} />
                                : <br />
                        }
                    </div>
                }
            </div>}
    </ContentWrapper>
}