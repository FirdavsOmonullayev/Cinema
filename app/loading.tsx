import { SkeletonGrid } from "@/components/skeleton-grid";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-40 w-full rounded-3xl" />
      <SkeletonGrid />
    </div>
  );
}


