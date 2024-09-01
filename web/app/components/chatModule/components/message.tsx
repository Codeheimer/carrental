import OtherMessage from "./otherMessage"
import YouMessage from "./youMessage"

export interface ChatMessage {
    sender: string
    message: string
}

export default function Message(chat: ChatMessage) {
    return (<>
        {chat.sender === 'You' ? <YouMessage {...chat} /> : <OtherMessage {...chat} />}
    </>
    )
}