import { FormEvent, useState } from 'react'
import GetProfileStatistic from '../StatisticsView/ProfileStatisticGetter';
import ContentWrapper from '../ContentWrapper'
import './SearchGame.css'
import { SecondaryActionButton } from '../../Components/ActionButtons/ActionButtons';
import GameStatus from './GameStatus';
import { useNavigate } from 'react-router-dom';

export default function SearchGameView() {

    const profile = GetProfileStatistic("user");
    const friendList = profile.friendList;
    let navigate = useNavigate();

    let [timeSelected, setTimeSelected] = useState(5);
    let [selectedOponent, setSelectedOponent] = useState(friendList[0].nickname);
    let [searching, setSearching] = useState(false);

    const changeTime = (event: any) => {
        setTimeSelected(event.target.value);
    }

    const changeOponent = (event: any) => {
        setSelectedOponent(event.target.value);
    }

    const searchSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearching(true);

        setTimeout(()=>{
            GameStatus.search();
            navigate("/game");
        },3000)
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
                    <tr>
                        <td className='LabelTag'>Oponent:</td>
                        <td className='LabelValue'>
                            <select className='SelectForm' value={selectedOponent} onChange={e => changeOponent(e)}>
                                {friendList.map((friend) =>
                                    <option value={friend.nickname}>{friend.nickname}</option>
                                )}
                            </select>
                        </td>
                    </tr>
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
                                <button className='SubmitButton' type="submit"><span className='Horse'>♞</span>Graj</button>
                            }
                        </td>
                    </tr>
                </table>
            </form>
        </div>
    </ContentWrapper>
}