"use client";
import dynamicImport from "next/dynamic";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const ClientWrapper = dynamicImport(() => import("./client-wrapper.jsx"), {
  ssr: false,
});

export default function Page() {
  return <ClientWrapper />;
}
