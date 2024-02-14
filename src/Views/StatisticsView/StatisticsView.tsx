import { useState } from 'react';
import ContentWrapper from '../ContentWrapper';
import GetProfileStatistic from './ProfileStatisticGetter';
import "./StatisticsView.css"
import { useNavigate, useParams } from 'react-router-dom';



export default function StatsView() {
    let navigate = useNavigate();

    const { name } = useParams();
    const username = name ? name : "user";
    let profile = GetProfileStatistic(username);
    let userLogged = username == null || username === "user";

    let [selectedMatch, setSelectedMatch] = useState(-1);
    const friends = profile.friendList;
    let [selectedFriend, setSelectedFriend] = useState(0);
    let [selectedFriendName, setSelectedFriendName] = useState(friends[0].nickname);

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

    const friendClicked = (name: string) => {
        navigate(`/statistic/${name}`);
    };

    return <ContentWrapper>
        <table className='StatisticsTable'>
            <tr>
                <td>
                    <h1 className='ProfileName'>{profile.nickname}</h1>
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
                <td className='LabelTag'>Zwycięstwa</td>
                <td>{profile.winrate}</td>
            </tr>
            <tr className='FormRecord'>
                <td className='LabelTag'>Zwycięstwa(SI)</td>
                <td>{profile.winrateAI}</td>
            </tr>
            <tr className='FormRecord'>
                <td className='LabelTag'>Zwycięstwa(Znajomi)</td>
                <td>{profile.winrateFriends}</td>
            </tr>
            <tr className='FormRecord'>
                <td className='LabelTag'>Filtr</td>
                <td>
                    <select value={selectedFriendName}
                        onChange={(e) => changeFriend(e)}>
                        {friends.map((friend) =>
                            <option value={friend.nickname}>{friend.nickname}</option>
                        )}
                    </select>
                </td>
            </tr>
            <tr className='FormRecord'>
                <td className='LabelTag'>Wynik</td>
                <td>{friends[selectedFriend].winrate}</td>
            </tr>
            <tr>
                <td>
                    <h2 className='LabelHeader'>Znajomi:</h2>
                </td>
            </tr>
            {profile.friendList.map((friend, i) => (
                <tr key={i} className='FormRecord'>
                    <td className='LabelTag' onClick={() => (friendClicked(friend.nickname))}>{friend.nickname}</td>
                </tr>
            ))}
        </table>
        {!userLogged ? <br /> :
            <div>
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
                    {profile.matches.map((match, i) => (
                        <tr key={i} className={selectedMatch === i ? 'GameHistory Selected' : 'GameHistory'} onClick={() => (matchClicked(i))}>
                            <td className='LabelValue'>{match.white}</td>
                            <td className='LabelValue'>{match.black}</td>
                            <td className='LabelValue'>{match.win}</td>
                            <td className='LabelValue'>{match.mode}</td>
                            <td className='LabelValue'>{match.date.toString()}</td>
                        </tr>
                    ))}
                </table>{
                    selectedMatch !== -1 ?
                        <table>
                            <tr>
                                <td>
                                    <h2 className='LabelHeader'>Historia partii:</h2>
                                </td>
                            </tr>
                            <tr>
                                    <td className='MatchHeader'>Gracz</td>
                                    <td className='MatchHeader'>Figura</td>
                                    <td className='MatchHeader'>Ruch</td>
                                </tr>
                            {profile.matches[selectedMatch].history.map((move, i) => (
                                <tr key={i}>
                                    <td className='LabelValue'>{move.player}</td>
                                    <td className='LabelValue'>{move.piece}</td>
                                    <td className='LabelValue'>{move.place}</td>
                                </tr>
                            ))}
                        </table>
                        : <br />
                }
            </div>
        }
    </ContentWrapper>
}