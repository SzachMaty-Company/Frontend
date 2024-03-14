import { useEffect, useState } from 'react';
import ContentWrapper from '../ContentWrapper';
import GetProfileStatistic from './ProfileStatisticGetter';
import "./StatisticsView.css"
import { useNavigate, useParams } from 'react-router-dom';
import GameSummaryHistory from '../GameSummaryView/GameSummaryHistory';
import ProfileStatistic, { Friend, Match } from './ProfileStatistic';
import AuthComponent from '../../AuthComponent';

export default function StatsView() {
    let navigate = useNavigate();

    const params = useParams();
    const name: string | undefined = params.name;
    const userId: number | undefined = params.userId as number | undefined;

    const [profile, setProfile] = useState(new ProfileStatistic());
    let [selectedMatch, setSelectedMatch] = useState(-1);
    const friends = profile.friendList;
    let [isAddedToFriends, setIsAddedToFriends] = useState(false);
    let [selectedFriend, setSelectedFriend] = useState(0);
    let [selectedFriendName, setSelectedFriendName] = useState("");

    const checkIfFriend = () => {
        if (userId == null) {
            setIsAddedToFriends(true);
        } else {
            let len = friends.length;
            let i = 0;
            for (; i < len; i++) {
                if (friends[i].nickname === AuthComponent.UserNickname)
                    break;
            }
            setIsAddedToFriends(i != len);
        }
    }

    useEffect(() => {
        GetProfileStatistic(userId).then(
            p => {
                setProfile(p);
                setSelectedFriendName(p.friendList[0].nickname);
                checkIfFriend();
            }
        )
    }, []);

    let userLogged = name == null || name === "user";

    const changeFriend = (event: any) => {
        let id = 0;
        for (let i = 0; i < friends.length; i++) {
            if (friends[i].nickname === event.target.value) {
                id = i;
                break;
            }
        }
        setSelectedFriend(id);
        setSelectedFriendName(friends[id].nickname);
    };

    const matchClicked = (id: number) => {
        setSelectedMatch(id);
    };

    const friendClicked = (friend: Friend) => {
        navigate(`/statistic/${friend.nickname}`, {
            state: { userId: friend.id }
        });
    };

    const addFriend = () => {
        //http request
        setIsAddedToFriends(true);
    };

    console.log(profile.matches);

    return <ContentWrapper isCentered={false}>
        {profile.nickname == "" ?
            <p></p> :
            <div>
                <table className='StatisticsTable'>
                    <tr>
                        <td className='ProfileNameTd'>
                            <h1 className='ProfileName'>Grześ</h1>{isAddedToFriends ? <span></span> : <span className='AddToFriends' onClick={addFriend}>(<span>dodaj do znajomych</span>)</span>}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h2 className='LabelHeader'>Informacje:</h2>
                        </td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Imię</td>
                        <td>{profile.firstname}</td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Nazwisko</td>
                        <td>{profile.lastname}</td>
                    </tr>
                    <tr>
                        <td>
                            <h2 className='LabelHeader'>Statystyki:</h2>
                        </td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Wsp. Zwycięstw (AI)</td>
                        <td>{profile.winrateAI * 100}%</td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Zwycięstwa (AI)</td>
                        <td>{profile.winAI}</td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Rozegrane gry (AI)</td>
                        <td>{profile.playAI}</td>
                    </tr>

                    <tr className='FormRecord'>
                        <td className='LabelTag'>Wsp. Zwycięstw (Znajomi)</td>
                        <td>{profile.winrateFriends * 100}%</td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Zwycięstwa (Znajomi)</td>
                        <td>{profile.winFriends}</td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Rozegrane gry (Znajomi)</td>
                        <td>{profile.playFriends}</td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Wybierz znajomego</td>
                        <td>
                            <select value={selectedFriendName}
                                onChange={(e) => changeFriend(e)}>
                                {friends.map((friend: Friend) =>
                                    <option value={friend.nickname}>{friend.nickname}</option>
                                )}
                            </select>
                        </td>
                    </tr>
                    <tr className='FormRecord'>
                        <td className='LabelTag'>Wsp. Zwycięstw</td>
                        <td>{friends[selectedFriend].winrate}</td>
                    </tr>
                    <tr>
                        <td>
                            <h2 className='LabelHeader'>Znajomi:</h2>
                        </td>
                    </tr>
                    {profile.friendList.map((friend: Friend, i: number) => (
                        <tr key={i} className='FormRecord'>
                            <td className='LabelTag' onClick={() => (friendClicked(friend))}><span className='friend'>{friend.nickname}</span></td>
                        </tr>
                    ))}
                </table>
                {!userLogged ? <br /> :
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
                            {profile.matches.map((match: Match, i: number) => (
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
                                <GameSummaryHistory title='Historia partii:' gameHistory={profile.matches[selectedMatch].history} />
                                : <br />
                        }
                    </div>
                }
            </div>}
    </ContentWrapper>
}