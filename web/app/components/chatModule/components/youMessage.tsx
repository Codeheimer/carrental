import { ChatMessage } from "./message";

export default function YouMessage(chat: ChatMessage) {
    return (<div className="flex gap-3 my-4 justify-end text-gray-600 text-sm flex-1">
        <div className="flex flex-col items-end">
            <span className="block font-extrabold text-gray-700 my-1">
                {'You'}
            </span>
            <p className="tracking-wider max-w-[300px] my-1 font-medium text-white bg-gray-400 p-2 rounded-3xl whitespace-normal break-words">
                {chat.message}
            </p>
        </div>
        <div className="flex justify-end items-start" style={{ marginTop: '5px' }}>
            <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                <div className="rounded-full bg-gray-100 border p-1">
                    <svg stroke="none" fill="black" strokeWidth="0"
                        viewBox="0 0 16 16" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z">
                        </path>
                    </svg>
                </div>
            </span>
        </div>
    </div>)
}