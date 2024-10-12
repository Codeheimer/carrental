'use client';

import GenericButton, { createButtonDetails } from "@/app/components/fields/genericButton"
import { Vehicle } from "@/app/services/vehicleService";
import useAuthStore from "@/app/stores/authStore";
import useGlobalServiceStore from "@/app/stores/globalServiceStore";

export default function DevPanel() {
    const { vehicleService } = useGlobalServiceStore();
    const { session } = useAuthStore();
    const dummyListings = [
        {
            "plateNumber": "AAA-1234",
            "make": "Toyota",
            "model": "Fortuner",
            "year": "2012",
            "engineDisplacement": "2.0",
            "seater": "8",
            "title": "FOR Rent Fortuner 2012",
            "description": "Mahina na yung break. Suitable for family trips, but brakes need maintenance soon. Spacious interior and reliable engine, great for long drives. Affordable rental price."
        },
        {
            "plateNumber": "BBB-5678",
            "make": "Honda",
            "model": "Civic",
            "year": "2018",
            "engineDisplacement": "1.8",
            "seater": "6",
            "title": "Rent Honda Civic 2018",
            "description": "Mabilis at matipid sa gas. Ideal for city driving, this Civic is known for its excellent fuel efficiency and smooth handling. Modern interiors and well-maintained."
        },
        {
            "plateNumber": "CCC-9012",
            "make": "Ford",
            "model": "Ranger",
            "year": "2020",
            "engineDisplacement": "3.2",
            "seater": "6",
            "title": "For Rent Ford Ranger 2020",
            "description": "Perfect for off-road trips, with a powerful engine and a tough exterior. Spacious cabin and excellent handling. Great for adventure enthusiasts looking for a rugged vehicle."
        },
        {
            "plateNumber": "DDD-3456",
            "make": "Nissan",
            "model": "Almera",
            "year": "2017",
            "engineDisplacement": "1.5",
            "seater": "5",
            "title": "Nissan Almera for Rent",
            "description": "Compact and fuel-efficient, ideal for everyday use. Comfortable seating for five with a surprising amount of trunk space. Great condition, no major issues."
        },
        {
            "plateNumber": "EEE-7890",
            "make": "Hyundai",
            "model": "Accent",
            "year": "2019",
            "engineDisplacement": "1.4",
            "seater": "5",
            "title": "Rent Hyundai Accent 2019",
            "description": "Reliable, compact sedan with excellent fuel economy. Perfect for city commutes and short trips. Clean interiors, well-maintained, and easy to drive in urban environments."
        },
        {
            "plateNumber": "FFF-1234",
            "make": "Chevrolet",
            "model": "Trailblazer",
            "year": "2016",
            "engineDisplacement": "2.8",
            "seater": "7",
            "title": "For Rent Chevrolet Trailblazer 2016",
            "description": "Spacious SUV, perfect for family outings or large groups. Strong engine and comfortable interiors. Great for long-distance travel, with room for luggage and passengers."
        },
        {
            "plateNumber": "GGG-5678",
            "make": "Mitsubishi",
            "model": "Montero",
            "year": "2015",
            "engineDisplacement": "2.5",
            "seater": "7",
            "title": "Rent Mitsubishi Montero 2015",
            "description": "Well-known for its durability and off-road capability, the Montero is ideal for long trips or out-of-town excursions. Great air conditioning and smooth ride."
        },
        {
            "plateNumber": "HHH-9012",
            "make": "Toyota",
            "model": "Vios",
            "year": "2021",
            "engineDisplacement": "1.5",
            "seater": "5",
            "title": "Toyota Vios 2021 for Rent",
            "description": "Almost brand new, reliable and fuel-efficient. Perfect for urban driving with great mileage. Spacious interior and modern features, making every trip comfortable."
        },
        {
            "plateNumber": "III-3456",
            "make": "Kia",
            "model": "Sportage",
            "year": "2019",
            "engineDisplacement": "2.0",
            "seater": "5",
            "title": "Rent Kia Sportage 2019",
            "description": "A compact SUV with excellent handling and fuel efficiency. Great for both city drives and light off-roading. Very comfortable and safe for families."
        },
        {
            "plateNumber": "JJJ-7890",
            "make": "Suzuki",
            "model": "Ertiga",
            "year": "2020",
            "engineDisplacement": "1.5",
            "seater": "7",
            "title": "Suzuki Ertiga for Rent",
            "description": "Practical and affordable seven-seater, perfect for big families or groups. Comfortable and spacious with a reliable engine. Easy to maneuver despite its size."
        },
        {
            "plateNumber": "KKK-1234",
            "make": "Mazda",
            "model": "CX-5",
            "year": "2018",
            "engineDisplacement": "2.5",
            "seater": "5",
            "title": "For Rent Mazda CX-5 2018",
            "description": "Stylish and sporty, this Mazda CX-5 is great for city and highway driving. Excellent handling, advanced safety features, and comfortable seating for long drives."
        },
        {
            "plateNumber": "LLL-5678",
            "make": "Toyota",
            "model": "Innova",
            "year": "2017",
            "engineDisplacement": "2.8",
            "seater": "8",
            "title": "Toyota Innova for Rent 2017",
            "description": "Spacious and ideal for family trips, the Innova offers a comfortable ride and reliable performance. Great for long drives, with ample space for passengers and luggage."
        },
        {
            "plateNumber": "MMM-9012",
            "make": "Isuzu",
            "model": "Mu-X",
            "year": "2019",
            "engineDisplacement": "3.0",
            "seater": "7",
            "title": "Isuzu Mu-X for Rent 2019",
            "description": "Strong and durable, this Mu-X is great for family road trips and off-road adventures. Well-maintained, with a powerful engine and spacious interiors."
        },
        {
            "plateNumber": "NNN-3456",
            "make": "Ford",
            "model": "Everest",
            "year": "2020",
            "engineDisplacement": "2.0",
            "seater": "7",
            "title": "Ford Everest for Rent 2020",
            "description": "Large, comfortable SUV with modern features. Perfect for long road trips and family vacations. Reliable and in excellent condition, with great fuel efficiency for its size."
        },
        {
            "plateNumber": "OOO-7890",
            "make": "Hyundai",
            "model": "Tucson",
            "year": "2016",
            "engineDisplacement": "2.0",
            "seater": "5",
            "title": "Hyundai Tucson for Rent",
            "description": "Compact and versatile, the Tucson is ideal for city and highway driving. Great handling and fuel efficiency. Spacious enough for small families or groups."
        },
        {
            "plateNumber": "PPP-1234",
            "make": "Mitsubishi",
            "model": "Pajero",
            "year": "2014",
            "engineDisplacement": "3.2",
            "seater": "7",
            "title": "Mitsubishi Pajero for Rent",
            "description": "Rugged and built for off-road adventures, the Pajero is perfect for those seeking excitement. Spacious and powerful, it can handle any terrain with ease."
        },
        {
            "plateNumber": "QQQ-5678",
            "make": "Nissan",
            "model": "Terra",
            "year": "2020",
            "engineDisplacement": "2.5",
            "seater": "7",
            "title": "Rent Nissan Terra 2020",
            "description": "New and in excellent condition, this Terra is perfect for family trips or group outings. It’s spacious, reliable, and built for both city and off-road driving."
        },
        {
            "plateNumber": "RRR-9012",
            "make": "Toyota",
            "model": "Hiace",
            "year": "2015",
            "engineDisplacement": "3.0",
            "seater": "12",
            "title": "Toyota Hiace for Rent 2015",
            "description": "Perfect for large groups or business trips, the Hiace offers a spacious and comfortable ride. Well-maintained and great for long journeys. Reliable and fuel-efficient."
        },
        {
            "plateNumber": "SSS-3456",
            "make": "Chevrolet",
            "model": "Suburban",
            "year": "2017",
            "engineDisplacement": "5.3",
            "seater": "7",
            "title": "Chevrolet Suburban for Rent",
            "description": "Luxurious and powerful"
        }]

    const handlePopulateListings = (): void => {
        dummyListings.forEach(l => {
            const newL: Vehicle = {
                ...l,
                owner: "",
                ownerId: Number(session.userId),
                seater: Number(l.seater),
                latitude: 0,
                longitude: 0
            }
            vehicleService.save(newL, session.token)
        })
    }

    return (<div className="flex flex-col w-full h-full justify-center items-center container mx-auto p-6">
        <GenericButton {...createButtonDetails("Populate Listings", "button", handlePopulateListings)} />
    </div>)
}