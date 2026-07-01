import { LoadingState } from "@/shared/components/molecules/States"

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
      <LoadingState text="Loading page content..." />
    </div>
  )
}
