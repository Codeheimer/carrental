'use client';

import useVehicleFilteringStore from "@/app/stores/vehicleFilteringStore";
import { useEffect, useState } from "react";
import { VehicleFilter } from "@/app/services/vehicleService";
import { generateJSONFromForm } from "@/app/utilities/formUtils";
import { useRouter } from "next/navigation";
import { beautifyVehicleAge, truncate } from "@/app/utilities/stringUtils";
import GenericButton, { createButtonDetails } from "./components/fields/genericButton";
import { Card, CardDescription, CardFooter, CardTitle } from "./components/card/card";
import ImageLoader from "./components/images/imageLoader";
import PaginationButton from "./components/pagination/paginationButton";
import PaginationIcon from "./components/svg/paginationIcon";
import GenericSlider from "./components/fields/slider";
import useGlobalServiceStore from "./stores/globalServiceStore";
import { Coordinate } from "./components/google/maps/googleMap";

export default function Home() {
  const TRUNCATE_LENGTH = 100;
  const { filter, doFilter, setFilter } = useVehicleFilteringStore();
  const { geolocationService } = useGlobalServiceStore();
  const router = useRouter();
  const [coordinate, setCoordinate] = useState<Coordinate>({ latitude: 0, longitude: 0 });

  useEffect(() => {
    geolocationService.getUserLocation()
      .then((coords: GeolocationCoordinates) => {
        setCoordinate({ latitude: coords.latitude, longitude: coords.longitude });
        console.log('User coordinates fetched:', coords);
      })
      .catch((error) => {
        console.error('Error fetching user location:', error);
      });
    setFilter(new VehicleFilter())
    doFilter()
  }, [doFilter, setFilter])

  const handleSubmit = (event: React.FormEvent) => {
    const json: VehicleFilter = { ...filter, ...generateJSONFromForm(event), result: [], pageNumber: 0, userLocation: coordinate };
    setFilter(json);
    event.preventDefault();
    doFilter();
  }

  const handleViewListing = (id: number): void => {
    router.push(`/vehicle/listing/${id}`);
  }

  const handlePageination = (page: number): void => {
    const currentFilter: VehicleFilter = { ...filter, pageNumber: page };
    setFilter(currentFilter);
    doFilter();
  }
  return (
    <div className="calc(var(--vh) * 100)">
      <div className="grid grid-cols-6 grid-rows-9 h-screen gap-2">
        <div className="col-span-1 row-span-9 justify-center  m-1 p-1">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center">
              <GenericSlider name="maxKm" max={1000} />
              <GenericButton {...createButtonDetails("Filter", "submit")} />
            </div>
          </form>
        </div>
        <div className="grid grid-cols-5 grid-rows-8 gap-3 col-span-5 row-span-8 m-1 p-1">
          {filter.result.map(card => (
            <Card key={card.id} onClick={() => handleViewListing(card.id)} className="hover:cursor-pointer duration-300 ease-in-out transition-transform transform hover:-translate-y-2 grid col-span-1 row-span-4 rounded-xl opacity-90">
              <div className="grid grid-cols-1 grid-rows-5">
                {card.pictures.map((url, key) =>
                  <ImageLoader key={key} src={url} alt={`picture`} className={`row-span-2 rounded-tl-xl rounded-tr-xl w-full h-full`} />)
                }
                <div className="row-span-3 m-1 p-1 grid grid-cols-1 grid-rows-6">
                  <CardTitle className="row-span-2">
                    <h2 className="line-clamp-2" title={card.title}>
                      {card.title}
                    </h2>
                  </CardTitle>
                  <CardDescription className="row-span-3">
                    <p className="line-clamp-3">
                      {truncate(card.description, TRUNCATE_LENGTH)}
                    </p>
                  </CardDescription>
                  <CardFooter className="row-span-1 flex flex-row text-sm font-light justify-between m-1 p-0">
                    <div>
                      <span className="font-bold text-xl text-red-600 dark:text-red-400">${card.price}<span className="text-sm font-normal">/day</span></span>
                    </div>
                    <div>{beautifyVehicleAge(card.age)}</div>
                  </CardFooter>
                </div>
              </div>
            </Card>
          )
          )}
        </div>

        {(filter.result && filter.result.length > 0) &&
          <div className="col-start-2 col-span-5 row-start-9 row-span-1">
            <div className="flex items-center justify-center space-x-2">
              <PaginationButton onClick={() => handlePageination(0)} disabled={filter.pageNumber === 0}>
                <>
                  <PaginationIcon type="first" />
                  First
                </>
              </PaginationButton>
              <PaginationButton onClick={() => handlePageination(filter.pageNumber - 1)} disabled={filter.pageNumber === 0}>
                <>
                  <PaginationIcon type="previous" />
                  Previous
                </>
              </PaginationButton>

              <span className="px-4 py-2 text-sm font-medium text-gray-700">Page {filter.pageNumber + 1} of {filter.totalPages}</span>
              <PaginationButton onClick={() => handlePageination(filter.pageNumber + 1)} disabled={filter.pageNumber === (filter.totalPages - 1)}>
                <>
                  Next
                  <PaginationIcon type="next" />
                </>
              </PaginationButton>
              <PaginationButton onClick={() => handlePageination(filter.totalPages - 1)} disabled={filter.pageNumber === (filter.totalPages - 1)}>
                <>
                  Last
                  <PaginationIcon type="last" />
                </>
              </PaginationButton>
            </div>
          </div>}
      </div>
    </div>
  );
}
