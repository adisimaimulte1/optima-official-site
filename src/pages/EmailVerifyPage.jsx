import { useEffect, useState } from "react";
import Particles from "../components/ParticlesBackground";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

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
  const [status, setStatus] = useState("checking");
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const height = window.innerHeight;
      const baseHeight = 900;
      const newScale = Math.min(1, height / baseHeight);
      setScale(newScale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

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
    <div className="relative w-screen h-screen overflow-hidden bg-[#FFC62D] text-[#24324A]">
      {/* Background Particles */}
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

      {/* Centered Scaling Content */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{ fontFamily: "Tusker" }}
      >
        <div
          className="flex flex-col items-center text-center transition-transform duration-300"
          style={{ transform: `scale(${scale})` }}
        >
          <img
            src="./assets/logo_foreground.png"
            alt="Optima Logo"
            className="w-60 h-60 mb-20"
          />

          {status === "verified" ? (
            <>
              <h1 className="text-5xl font-bold mb-4">Verification Succeeded</h1>
              <p className="text-lg max-w-md">
                Your account has been confirmed. You can close the window and get back to the app.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-4 text-red-700">Verification Failed</h1>
              <p className="text-lg max-w-md">
                The link is invalid or expired. Check your email again or contact the support team.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
