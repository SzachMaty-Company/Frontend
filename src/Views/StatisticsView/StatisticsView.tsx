import ContentWrapper from '../ContentWrapper';
import GetProfileStatistic from './ProfileStatisticGetter';
import "./StatisticsView.css"


export default function StatsView()
{
    const profile=GetProfileStatistic();

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
                    <input type='text' value={"Wartość"}/>
                </td>
            </tr>
            <tr className='FormRecord'>
                <td className='LabelTag'>Wynik</td>
                <td>Wartość</td>
            </tr>
        </table>
    </ContentWrapper>
}