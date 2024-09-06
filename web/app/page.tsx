'use client';
import { useEffect } from "react";
import VehicleFilterModule from "./components/vehicleFilterModule/vehicleFilterModule";
import useGlobalServiceStore from "./stores/globalServiceStore";
import useAuthStore from "./stores/authStore";

export default function Home() {
  const { authenticationService } = useGlobalServiceStore();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    authenticationService.verifyToken().then((response) => {
      if (response.isValid) {
        console.log("has existing token, do login")
        login();
      } else {
        console.log("no existing token. no login")
      }
    })
  });
  return (
    <div className="flex">
      <VehicleFilterModule />
    </div>
  );
}
