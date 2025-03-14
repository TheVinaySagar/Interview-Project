"use client"; // ✅ Ensure this runs only on the client

import useAuthCheck from "@/hooks/useAuthCheck";

export default function AuthChecker() {
  useAuthCheck();

  return null;
}
