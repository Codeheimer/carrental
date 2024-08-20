import { truncate } from "../../utilities/stringUtils";
import './style.css';

interface CardDetails {
    title: string
    description: string
    owner: string
    age: string,
    extraClassNames : string
}

const TRUNCATE_LENGTH = 50;

export default function Card({title,description,owner,age,extraClassNames}:CardDetails) {
    return (
        <div className={"card "+extraClassNames}>
            <div className="card-image"></div>
            <div className="category"> {title} </div>
            <div className="heading"> {truncate(description,TRUNCATE_LENGTH)}</div>
            <div className="author justify-between"> <div>By <span className="name">{owner}</span></div> <div>{age} days ago</div></div>
        </div>
    );
}