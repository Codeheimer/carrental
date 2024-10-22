'use client';
import VehicleFilterModule from "./components/vehicleFilterModule/vehicleFilterModule";

export default function Home() {
  return (
    <div className="calc(var(--vh) * 100)">
      <VehicleFilterModule />
    </div>
  );
}
