'use client';
import { useEffect } from "react";
import VehicleFilterModule from "./components/vehicleFilterModule/vehicleFilterModule";
import useGlobalServiceStore from "./stores/globalServiceStore";
import useAuthStore from "./stores/authStore";

export default function Home() {
  const { authenticationService } = useGlobalServiceStore();
  const login = useAuthStore((state) => state.login);
  const logThemeState = () => {
    console.log('Dark mode class present:', document.documentElement.classList.contains('dark'))
    console.log('localStorage darkMode value:', localStorage.getItem('darkMode'))
    console.log('prefers-color-scheme:', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  }
  useEffect(() => {
    //logThemeState();
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
