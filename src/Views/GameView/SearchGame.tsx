import { FormEvent, useEffect, useState } from 'react'
import { GetProfileStatistic, GetFriends } from '../../ApiHelpers/UserServiceClient';
import ContentWrapper from '../ContentWrapper'
import './SearchGame.css'
import { SecondaryActionButton } from '../../Components/ActionButtons/ActionButtons';
import GameStatus from './GameStatus';
import { useNavigate } from 'react-router-dom';
import ProfileStatistic from '../StatisticsView/ProfileStatistic';
import { createGame } from '../../ApiHelpers/GameLogicServiceClient';

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InVzZXIyIn0.2AfTfJR4nPP3Cj8W51V6H903081ilw5BwanT5OrpMNk";

export default function SearchGameView() { 




    const [profile, setProfile] = useState(new ProfileStatistic());
    const [friends, setFriends] = useState([] as ProfileStatistic[]);

    let [timeSelected, setTimeSelected] = useState(5);
    let [selectedOponent, setSelectedOponent] = useState(-1);
    let [searching, setSearching] = useState(false);
    let [isWhite, setIsWhite] = useState(true);
    let [playerType, setPlayerType] = useState("FRIEND");

    useEffect(() => {
        GetProfileStatistic(undefined).then(
            p => {
                setProfile(p);
            }
        );
        GetFriends(undefined).then(
            p => {
                setFriends(p);

                if (p.length !== 0) {
                    setSelectedOponent(p[0].id);
                }
            }
        );
    }, []);
    let navigate = useNavigate();

    const changeTime = (event: any) => {
        setTimeSelected(event.target.value);
    }

    const changeOponent = (event: any) => {
        setSelectedOponent(event.target.value);
    }

    const changePlayerType = (event: any) => {
        setPlayerType(event.target.value);
    }

    const changeColor = (event: any) => {
        setIsWhite(event.target.value === "WHITE")
    }

    const searchSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearching(true);
        let oponentName = playerType === "AI" ? "AI" : selectedOponent;
        let whitePlayer, blackPlayer;
        if (isWhite) {
            whitePlayer = profile.id;
            blackPlayer = oponentName;
        } else {
            whitePlayer = oponentName;
            blackPlayer = profile.id;
        }

        createGame(TOKEN, "localhost:8000", playerType, timeSelected.toString(), "WHITE", whitePlayer as string, blackPlayer as string).then(p => {
            GameStatus.search();
            navigate("/game/"+p.gameCode);
        });
    }

    const stopSearching = () => {
        setSearching(false);
        GameStatus.stopSearch();
    }

    return <ContentWrapper isCentered={true}>
        <div className="SearchGameView">
            <form onSubmit={searchSubmit}>
                <table className='SearchTable'>
                    <tr>
                        <td className='HeaderLabel' colSpan={2}><h1>Zagraj</h1></td>
                    </tr>
                    <tr>
                        <td className='LabelTag'>Graj z:</td>
                        <td className='LabelValue'>
                            <select className='SelectForm' value={playerType} onChange={e => changePlayerType(e)}>
                                <option value="AI">SI</option>
                                <option value="FRIEND">Przyjacielem</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td className='LabelTag'>Graj jako:</td>
                        <td className='LabelValue'>
                            <select className='SelectForm' value={isWhite?"WHITE":"BLACK"} onChange={e => changeColor(e)}>
                                <option value="BLACK">Czarny</option>
                                <option value="WHITE">Biały</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td className='LabelTag'>Czas gry:</td>
                        <td className='LabelValue'>
                            <select className='SelectForm' value={timeSelected} onChange={e => changeTime(e)}>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="30">30</option>
                            </select>
                        </td>
                    </tr>
                    {playerType==="AI"? <tr></tr>:
                        <tr>
                            <td className='LabelTag'>Oponent:</td>
                            <td className='LabelValue'>
                                <select className='SelectForm' value={selectedOponent} onChange={e => changeOponent(e)}>
                                    {friends.map((friend) =>
                                        <option value={friend.id}>{friend.name}</option>
                                    )}
                                </select>
                            </td>
                        </tr>
                    }

                    <tr>
                        <td colSpan={2}>
                            {searching ?
                                <div>
                                    <div className='Animation'>
                                        <div className='AnimationPart'>
                                            <p className='Loading'>♞</p>
                                        </div>
                                        <div className='AnimationPart'>
                                            <p>Oczekiwanie...</p>
                                        </div>
                                    </div>
                                    <div className='ButtonDiv' onClick={stopSearching}>
                                        <SecondaryActionButton text={"Anuluj"} />
                                    </div>
                                </div>
                                :
                                <button className='SubmitButton' type="submit"><span className='clickable'><span className='Horse'>♞</span>Graj</span></button>
                            }
                        </td>
                    </tr>
                </table>
            </form>
        </div>
    </ContentWrapper>
}