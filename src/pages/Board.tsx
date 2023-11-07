import BoardForm from "../components/board/BoardForm";
import BoardInput from "../components/board/BoardInput";
import {createContext, Dispatch, SetStateAction, useState} from "react";
import {Provider} from "react-redux";

export default function Board(){
    const refresher = useState(false);
    return (
        <BoardForm/>
    );
}
