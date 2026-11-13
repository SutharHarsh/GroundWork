import type { Metadata } from "next";
import { Suspense } from "react";
import View from "./view";

export const metadata: Metadata = { title: "Calendar" };

export default function Page() {
  return (
    <Suspense>
      <View />
    </Suspense>
  );
}
