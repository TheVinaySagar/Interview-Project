"use client"; // ✅ Ensure this runs only on the client

import useAuthCheck from "@/hooks/useAuthCheck";

export default function AuthChecker() {
  useAuthCheck(); // ✅ Run token validation on the client

  return null; // ✅ No UI, just a logic wrapper
}
