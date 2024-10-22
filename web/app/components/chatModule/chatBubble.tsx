import useChatStore from "@/app/stores/chatStore"

export default function ChatBubble() {
    const { toggleChat, notificationCount } = useChatStore();
    return (<button onClick={toggleChat}
        className="bg-background fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 m-0 cursor-pointer p-0 normal-case leading-5"
        type="button" aria-haspopup="dialog" aria-expanded="false" data-state="closed">
        <svg xmlns=" http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={'2'} strokeLinecap={'round'} strokeLinejoin="round"
            className="text-foreground block align-middle">
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" className="">
            </path>
        </svg>
        {notificationCount > 0 &&
            (<div className="flex justify-center items-center rounded-full absolute -top-[0.10rem] -right-[0.10rem] 
                h-7 w-7 bg-red-700 text-white text-lg">
                {notificationCount}
            </div>)}
    </button>)
}