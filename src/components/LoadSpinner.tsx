export function LoadSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
    </div>
  );
}
