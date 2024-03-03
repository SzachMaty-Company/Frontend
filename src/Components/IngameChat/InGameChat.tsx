import './InGameChat.css'
import { MainActionButton } from '../ActionButtons/ActionButtons'
import  ChatMessage from '../ChatMessage/ChatMessage'
import { useState } from 'react';

interface ChatMessageInterface {
    text: string;
    sideOfChat: boolean;
    date: Date;
}

interface ChatMessageProps {
  messages: ChatMessageInterface[];
  sentMessage: (text:string) => void;
  closeable: boolean;
}

const InGameChat: React.FC<ChatMessageProps> = ({messages, sentMessage, closeable}) => {   

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const textInput = form.elements.namedItem('msg') as HTMLInputElement;

        if (textInput) {
        const text = textInput.value;
        sentMessage(text);
        }
   };

    const [isHidden, setIsHidden] = useState(false);

    const toggleVisibility = () => {
        setIsHidden(!isHidden);
    };

    if (isHidden)
        return <></>

    return (
        <div className='InGameChat'>
        <div className='ChatWindow'>
            <div className="chatHeader">
            <div className='receiverUserName'>
                <span>ZbigniewZiobro</span>
            </div>
            {closeable && (
                <div className='closeChatWindow' onClick={() => {toggleVisibility()}}>
                X
                </div>
            )}
            </div>
            <div className='conversation'>
            {messages.map((message, index) => (
                <ChatMessage key={index} text={message.text} sideOfChat={message.sideOfChat} date={message.date}></ChatMessage>  
            ))}
            </div>
            <div className='controls'>
            <form onSubmit={handleSubmit}>
                <table>
                <tbody>
                    <tr>
                    <td>
                        <input name="msg" type="text" />
                    </td>
                    <td>
                        <MainActionButton text="wyślij"></MainActionButton>
                    </td>
                    </tr>
                </tbody>
                </table>
            </form>
            </div>
        </div>
        </div>
    );
}

export default InGameChat;