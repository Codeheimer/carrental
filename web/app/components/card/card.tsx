import { truncate } from "../../utilities/stringUtils";
import './style.css';

interface CardDetails {
    title: string
    description: string
    owner: string
    age: string
}

const TRUNCATE_LENGTH = 50;

export default function Card({ title, description, owner, age }: CardDetails) {
    return (
        <div className="mx-auto">
            <a href="#" className="relative inline-block duration-300 ease-in-out transition-transform transform hover:-translate-y-2 w-full">
                <div className="shadow p-4 rounded-lg bg-white">
                    <div className="flex justify-center relative rounded-lg overflow-hidden h-52">
                        <div className="transition-transform duration-500 transform ease-in-out hover:scale-110 w-full">
                            <div className="absolute inset-0 bg-black opacity-10"></div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h2 className="font-medium text-base md:text-lg text-gray-800 line-clamp-1" title="New York">
                            {title}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 grid-rows-1 gap-4 mt-4 min-h-14 min-w-80">
                        <p className="inline-flex flex-col xl:flex-row xl:items-center text-gray-800">
                            {truncate(description, TRUNCATE_LENGTH)}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 mt-4">
                        <div className="flex items-center">
                            <div className="relative">
                                <div className="rounded-full w-6 h-6 md:w-8 md:h-8 bg-gray-200"></div>
                                <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-primary-red rounded-full"></span>
                            </div>

                            <p className="ml-2 text-gray-800 line-clamp-1">
                                {owner}
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <p className="inline-block font-semibold text-primary whitespace-nowrap leading-tight rounded-xl">
                                <span className="text-sm uppercase">
                                    $
                                </span>
                                <span className="text-lg">3,200</span>/m
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 mt-4">
                        {age} days ago
                    </div>
                </div>
            </a>
        </div>

    );
}