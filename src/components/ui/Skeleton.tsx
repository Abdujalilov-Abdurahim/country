interface SkeletonProps { className?: string; }

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function CountryCardSkeleton() {
  return (
    <div className="card p-4 animate-pulse">
      <Skeleton className="w-full h-40 mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-3" />
      <div className="grid grid-cols-2 gap-2 mb-3">
        <Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-full" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

export function CountryGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => <CountryCardSkeleton key={i} />)}
    </div>
  );
}

export function CountryDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
      <div className="card p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-48 h-32 md:w-64 md:h-44" />
          <div className="flex-1">
            <Skeleton className="h-8 w-3/4 mb-3" />
            <Skeleton className="h-5 w-1/2 mb-6" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}><Skeleton className="h-3 w-1/2 mb-1" /><Skeleton className="h-4 w-3/4" /></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-6">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, j) => <Skeleton key={j} className="h-4 w-full" />)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
