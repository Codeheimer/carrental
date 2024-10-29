'use client';

export default function Home() {
  return (<div className="h-[500px] relative">
    <div className="absolute inset-0 filter blur-sm bg-[url('/images/landing-banner.jpg')] bg-cover bg-no-repeat bg-center"></div>
    <div className="relative flex items-center justify-center text-white h-full bg-opacity-10">
      <div className="flex flex-col justify-center items-center">
        <div className="text-3xl font-bold m-2 p-2">
          RENT YOUR CAR TODAY
        </div>
        <div className="text-2xl">
          Click on the Catalogue to start finding a car for you.
        </div>
      </div>
    </div>
  </div>)
}
