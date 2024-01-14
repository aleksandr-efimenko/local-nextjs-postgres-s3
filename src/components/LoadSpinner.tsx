import { type LoadSpinnerProps } from "~/utils/types";

export function LoadSpinner({ size = "medium" }: LoadSpinnerProps) {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-16 w-16",
    large: "h-24 w-24",
  };
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={`animate-spin rounded-full border-b-2 border-t-2 border-gray-900 ${sizeClasses[size]}`}
      ></div>
    </div>
  );
}
