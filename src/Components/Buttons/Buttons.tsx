import './Buttons.css'

export function Button({text,callback}:{text:string,callback:any}){
    return <button className='button' onClick={callback}>{text}</button>
}