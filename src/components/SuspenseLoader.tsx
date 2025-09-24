type SuspenseLoaderProps = {
  className?: string;
};

export function SuspenseLoader({ className = "h-96" }: SuspenseLoaderProps) {
  return (
    <div className={`w-full ${className} flex items-center justify-center`}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
        </div>
        <p className="text-indigo-600 font-medium">Memuat...</p>
      </div>
    </div>
  );
}

export default SuspenseLoader;