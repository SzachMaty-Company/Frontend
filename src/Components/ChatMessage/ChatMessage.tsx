import { StringLiteral } from 'typescript';
import './ChatMessage.css'

interface ChatMessageProps {
  text: string;
  sideOfChat: boolean;
  date: Date;
  type: string;
}
const padZero = (num:number) => (num < 10 ? `0${num}` : num);

const ChatMessage: React.FC<ChatMessageProps> = ({text, sideOfChat, date, type}) =>{

  const containerStyle = {
    display: 'flex',
    justifyContent: sideOfChat ? "left" : "right"  
  };

    return <div style={containerStyle}>
        <div className='ChatMessage'>
            <div className='messageContentHolder'>
                <div className='messageInfo'>
                    <table>
                        <tr>
                            <td>
                                {`${padZero(date.getDate())}.${padZero(date.getMonth() + 1)}.${date.getFullYear()}`}
                            </td>
                            <td>
                                {`${padZero(date.getHours())}:${padZero(date.getMinutes())}`}
                            </td>
                        </tr>
                    </table>
                </div>
                <div className={`messageText ${sideOfChat ? "receivedText" : "sentText"}`}>
                    {type == "INVITE" ? <span>Elo, elo, mój kolego! Może jakiś intelektualny sparing? - <a href={"/game/"+text}>Dołącz</a> </span> : text}
                </div>
                </div>
            </div> 
    </div>
}

export default ChatMessage;