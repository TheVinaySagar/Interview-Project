// "use client"; // ✅ Ensure this runs only on the client

// import { useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { getAuth, signOut } from "firebase/auth";

// const useAuthCheck = (): void => {
//   const router = useRouter(); // ✅ Hook ko component ke andar rakho
//   const pathname = usePathname(); // ✅ Current route check karo

//   const logoutUser = async () => {
//     const auth = getAuth();
//     await signOut(auth); // ✅ Firebase session clear karega

//     localStorage.removeItem("authToken");
//     localStorage.removeItem("tokenExpiry");

//     if (pathname !== "/login") {
//       router.push("/login"); // ✅ Redirect only if NOT already on login page
//     }
//   };

//   useEffect(() => {
//     if (pathname === "/login") return; // ✅ Already on login page, skip check

//     const token = localStorage.getItem("authToken");
//     const expiryTime = localStorage.getItem("tokenExpiry");

//     if (!token || !expiryTime || Date.now() > parseInt(expiryTime)) {
//       logoutUser();
//     }

//     const tokenExpiry = localStorage.getItem("tokenExpiry");
//     if (tokenExpiry) {
//       const timeLeft = parseInt(tokenExpiry) - Date.now();
//       if (timeLeft > 0) {
//         const timeout = setTimeout(logoutUser, timeLeft);
//         return () => clearTimeout(timeout);
//       } else {
//         logoutUser();
//       }
//     }
//   }, [pathname]); // ✅ Runs only when route changes
// };

// export default useAuthCheck;


"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const useAuthCheck = (): void => {
  const router = useRouter();
  const pathname = usePathname();
  const auth = getAuth();

  useEffect(() => {
    const protectedRoutes = ["/dashboard", "/profile", "/settings"]; // ✅ Protected pages

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const tokenExpiry = localStorage.getItem("tokenExpiry");

      if (!user || !tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
        if (protectedRoutes.includes(pathname)) {
          await signOut(auth); // ✅ Firebase se logout
          localStorage.removeItem("authToken");
          localStorage.removeItem("tokenExpiry");
          router.push("/login"); // ✅ Redirect to login
        }
      } else {
        // ✅ Auto logout after token expiry
        const timeLeft = parseInt(tokenExpiry) - Date.now();
        setTimeout(async () => {
          await signOut(auth);
          localStorage.removeItem("authToken");
          localStorage.removeItem("tokenExpiry");
          router.push("/login");
        }, timeLeft);
      }
    });

    return () => unsubscribe();
  }, [pathname]);
};

export default useAuthCheck;
