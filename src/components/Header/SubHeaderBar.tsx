// components/Header/SubHeaderBar.tsx
import { Suspense } from "react";
import SubHeaderBarClient from "./SubHeaderBarClient";

export default async function SubHeaderBar() {
  return (
    <Suspense fallback={<div className="w-full h-[50px]" />}>
      <SubHeaderBarClient />
    </Suspense>
  );
}