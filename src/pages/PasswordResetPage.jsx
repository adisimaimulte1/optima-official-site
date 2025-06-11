import { useEffect, useState } from "react";
import Particles from "../components/ParticlesBackground";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB_dh_-ZW4Tt9do13GNhXv-BR6_2Y8bIGA",
  authDomain: "optima-78874.firebaseapp.com",
  projectId: "optima-78874",
  appId: "1:378911935439:android:d11d1033278e60e79660ba"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function PasswordResetPage() {
  const [scale, setScale] = useState(1);
  const [oobCode, setOobCode] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const code = params.get("oobCode");

    if (mode === "resetPassword" && code) {
      setOobCode(code);
    } else {
      setMessage("❌ Invalid or expired reset link.");
    }

    const updateScale = () => {
      const height = window.innerHeight;
      const baseHeight = 900;
      setScale(Math.min(1, height / baseHeight));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("❌ Parolele nu coincid.");
      return;
    }
    try {
      await firebase.auth().confirmPasswordReset(oobCode, newPassword);
      setMessage("✅ Parola a fost resetată cu succes. Te poți autentifica cu noua parolă.");
      setTimeout(() => {
        window.location.href = "https://optima-78874.firebaseapp.com/login";
      }, 4000);
    } catch (error) {
      console.error("Password reset failed:", error);
      setMessage("❌ Eroare la resetarea parolei: " + error.message);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FFC62D] text-[#24324A]">
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

      <div
        className="absolute inset-0 z-10 flex items-center justify-center text-center"
        style={{ fontFamily: "Tusker" }}
      >
        <div
          className="flex flex-col items-center gap-6 w-full max-w-md px-6 transition-transform duration-300"
          style={{ transform: `scale(${scale})` }}
        >
          <img
            src="./assets/logo_foreground.png"
            alt="Optima Logo"
            className="w-60 h-60 mb-4"
          />
          <h1 className="text-4xl font-bold">Resetează-ți parola</h1>
          <p className="text-lg">Setează o parolă nouă pentru contul tău.</p>

          {oobCode && (
            <form onSubmit={handleReset} className="flex flex-col gap-4 w-full">
              <input
                type="password"
                placeholder="Parolă nouă"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="p-3 rounded-md border-4 border-[#24324A] text-[#24324A] bg-[#FFE8A7] focus:outline-none"
              />
              <input
                type="password"
                placeholder="Confirmă parola"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="p-3 rounded-md border-4 border-[#24324A] text-[#24324A] bg-[#FFE8A7] focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#24324A] text-[#FFC62D] font-bold py-2 px-4 rounded hover:opacity-90"
              >
                Resetează parola
              </button>
            </form>
          )}

          {message && <p className="mt-4 text-base">{message}</p>}
        </div>
      </div>
    </div>
  );
}
