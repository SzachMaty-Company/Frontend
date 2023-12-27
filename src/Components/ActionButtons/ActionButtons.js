import './ActionButtons.css';

function ActionButton({className, text})
{
    return (
        <button type="submit" className={className}>
            {text}
        </button>
    );
}

function MainActionButton({text})
{
    return <ActionButton className="mainActionButton" text={text}></ActionButton>
}

function SecondaryActionButton({text})
{
    return <ActionButton className="secondaryActionButton" text={text}></ActionButton>
}


export {MainActionButton, SecondaryActionButton};