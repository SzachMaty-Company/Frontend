import './InGameChat.css'
import { MainActionButton } from '../ActionButtons/ActionButtons'
import  ChatMessage from '../ChatMessage/ChatMessage'

interface ChatMessageInterface {
    text: string;
    sideOfChat: boolean;
    date: Date;
}

interface ChatMessageProps {
  messages: ChatMessageInterface[];
  sentMessage: (text:string) => void;
}

const InGameChat: React.FC<ChatMessageProps> = ({messages, sentMessage}) => {   

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const textInput = form.elements.namedItem('msg') as HTMLInputElement;

        if (textInput) {
        const text = textInput.value;
        sentMessage(text);
        }
   };



    return <div className='InGameChat'>
        <div className='ChatWindow'>
            <div className='receiverUserName'>
                <span>Czat z Zbigniewem Ziobro</span>
            </div>
            <div className='conversation'>
                {
                    messages.map((message) => (
                        <ChatMessage text={message.text} sideOfChat={message.sideOfChat} date={message.date}></ChatMessage>  
                    ))
                }
            </div>
            <div className='controls'>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tr>
                            <td>
                                <input name="msg" type="text">
                                </input>
                            </td>
                            <td>
                                <MainActionButton text="wyślij"></MainActionButton>
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    </div>
}

export default InGameChat;