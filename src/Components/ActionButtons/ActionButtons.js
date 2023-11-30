import './ActionButtons.css';

function ActionButton({className, text})
{
    return (
        <div className={className}>
            {text}
        </div>
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