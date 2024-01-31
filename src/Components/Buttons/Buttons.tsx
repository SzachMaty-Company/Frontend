import './Buttons.css'

export function Button({text,callback,type=""}:{text:string,callback:any,type?:string}){
    return <button className={'button '+type} onClick={callback}>{text}</button>
}