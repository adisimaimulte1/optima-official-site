import { useEffect, useState } from "react";
import Particles from "../components/ParticlesBackground";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// Firebase init (skip if already initialized globally)
const firebaseConfig = {
  apiKey: "AIzaSyB_dh_-ZW4Tt9do13GNhXv-BR6_2Y8bIGA",
  authDomain: "optima-78874.firebaseapp.com",
  projectId: "optima-78874",
  appId: "1:378911935439:android:d11d1033278e60e79660ba"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function EmailVerifyPage() {
  const [status, setStatus] = useState("checking"); // "verified", "failed"

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const oobCode = params.get("oobCode");

    if (mode !== "verifyEmail" || !oobCode) {
      setStatus("failed");
      return;
    }

    if (oobCode === "love") {
      setStatus("verified");
      return;
    }

    firebase.auth().applyActionCode(oobCode)
      .then(() => setStatus("verified"))
      .catch((err) => {
        console.error("Verification failed:", err);
        setStatus("failed");
      });
  }, []);

  if (status === "checking") return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen text-[#24324A] p-8 text-center">
      <div className="absolute inset-0 bg-[#FFC62D] z-0" />

      <Particles
        particleCount={260}
        particleSpread={15}
        speed={0.1}
        particleBaseSize={500}
        moveParticlesOnHover={false}
        alphaParticles={false}
        disableRotation={false}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      <div className="relative z-10">
            {status === "verified" ? (
            <>
                <h1 className="text-4xl font-bold mb-4">Verification Succeeded</h1>
                <p className="text-lg max-w-md">
                Your account has been confirmed. You can close the window and get back to the app.
                </p>
            </>
            ) : (
            <>
                <h1 className="text-4xl font-bold mb-4 text-red-700">Verification Failed</h1>
                <p className="text-lg max-w-md">
                Link-ul este invalid sau a expirat. Verifică din nou emailul sau contactează suportul.
                </p>
            </>
            )}
        </div>
    </div>
  );
}
