import { useEffect, useRef, useState } from 'react';
import GenericButton, { createButtonDetails } from '../../fields/genericButton';
import useGlobalServiceStore from '@/app/stores/globalServiceStore';

export interface Coordinate {
    latitude: number | undefined,
    longitude: number | undefined
}

export interface MapProps {
    width: string,
    height: string,
    callback?: (coord: Coordinate) => void
}

export default function GoogleMap({ width = 'w-full', height = 'h-94', callback = (coord: Coordinate) => { } }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const [coordinate, setCoordinate] = useState<Coordinate>({ latitude: 0, longitude: 0 });
    const [isMapScriptLoaded, setIsMapScriptLoaded] = useState(false);
    const [pinned, setPinned] = useState<boolean>(false);
    const [pinnedCoordinate, setPinnedCoordinate] = useState<Coordinate | null>(null)
    const {geolocationService} = useGlobalServiceStore();
    
    useEffect(() => {
        if (mapInstanceRef.current || !mapRef.current) return;

        const loadMapScript = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}`;
            script.async = true;
            script.defer = true;
            script.onload = () => setIsMapScriptLoaded(true);
            document.head.appendChild(script);

            return () => {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            };
        };

        const cleanUpScript = loadMapScript();

        geolocationService.getUserLocation()
            .then((coords: GeolocationCoordinates) => {
                setCoordinate({ latitude: coords.latitude, longitude: coords.longitude });
                console.log('User coordinates fetched:', coords);
            })
            .catch((error) => {
                console.error('Error fetching user location:', error);
            });

        return cleanUpScript;
    }, []);

    const lockMap = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setOptions({
                scrollwheel: false,
                draggable: false,
            });

            if (mapInstanceRef) {
                const position = mapInstanceRef.current!.getCenter();
                console.log(`Marker position: ${position?.lat()}, ${position?.lng()}`);
                setPinned(true);
                const coord = { latitude: position?.lat(), longitude: position?.lng() };
                setPinnedCoordinate(coord)
                callback(coord)
            }
        }
    };

    const unlockMap = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setOptions({
                scrollwheel: true,
                draggable: true,
            });
            setPinned(false);
            setPinnedCoordinate(null);
        }
    }

    useEffect(() => {
        if (isMapScriptLoaded && coordinate.latitude !== 0 && coordinate.longitude !== 0) {
            mapInstanceRef.current = new window.google.maps.Map(mapRef.current!, {
                center: { lat: coordinate.latitude, lng: coordinate.longitude },
                zoom: 12,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
            });
            if (mapInstanceRef.current) {
                const centerMarker = new google.maps.Marker({
                    position: { lat: Number(coordinate.latitude), lng: Number(coordinate.longitude) },
                    map: mapInstanceRef.current,
                    title: "Center",
                });

                mapInstanceRef.current.addListener('center_changed', () => {
                    const newCenter = mapInstanceRef.current!.getCenter();
                    if (newCenter && centerMarker) {
                        centerMarker.setPosition(newCenter); // Update marker's position to the new center
                    }
                })
            }
        }
    }, [isMapScriptLoaded, coordinate]);

    return (<>
        <div ref={mapRef} className={`${height} ${width}`} />
        {pinned ? <GenericButton {...createButtonDetails('Unpin', "button", unlockMap)} /> :
            <GenericButton {...createButtonDetails('Pin', "button", lockMap)} />}
    </>
    );
}

declare global {
    interface Window {
        google: any;
    }
}