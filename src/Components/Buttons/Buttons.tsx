import './Buttons.css'

export function Button({text,callback,type="",horse=false}:{text:string,callback:any,type?:string,horse?:boolean}){
    return <button className={'button '+type} onClick={callback}>
        {horse?<span className='horse'>♞</span>:""}<span>{text}</span>
        </button>
}