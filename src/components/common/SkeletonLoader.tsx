import React from 'react';

interface CosmicSkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  height?: string | number;
  width?: string | number;
}

export const CosmicSkeleton: React.FC<CosmicSkeletonProps> = ({
  className = '',
  rounded = '2xl',
  height,
  width,
}) => {
  const roundedClass =
    rounded === 'full'
      ? 'rounded-full'
      : rounded === '3xl'
      ? 'rounded-3xl'
      : rounded === '2xl'
      ? 'rounded-2xl'
      : rounded === 'xl'
      ? 'rounded-xl'
      : rounded === 'lg'
      ? 'rounded-lg'
      : rounded === 'md'
      ? 'rounded-md'
      : 'rounded-sm';

  return (
    <div
      className={`cosmic-shimmer bg-[#141228]/80 border border-purple-500/20 ${roundedClass} ${className}`}
      style={{
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
      }}
      aria-hidden="true"
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="galaxy-glass-card rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between border border-purple-500/20 shadow-lg">
      <div>
        {/* Product Image Skeleton */}
        <div className="relative aspect-square w-full">
          <CosmicSkeleton className="w-full h-full" rounded="2xl" />
          {/* Badge Skeletons */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <CosmicSkeleton className="w-12 h-5" rounded="full" />
          </div>
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
            <CosmicSkeleton className="w-16 h-5" rounded="full" />
          </div>
        </div>

        {/* Content details skeleton */}
        <div className="p-3 sm:p-4 space-y-2">
          <div className="flex items-center justify-between">
            <CosmicSkeleton className="w-16 h-3" rounded="md" />
            <CosmicSkeleton className="hidden sm:block w-10 h-3" rounded="md" />
          </div>
          <CosmicSkeleton className="w-4/5 h-4" rounded="md" />
          <CosmicSkeleton className="w-3/5 h-3" rounded="md" />

          <div className="flex items-center justify-between pt-1">
            <CosmicSkeleton className="w-20 h-5" rounded="md" />
            <CosmicSkeleton className="w-14 h-4" rounded="md" />
          </div>

          <CosmicSkeleton className="w-full h-7 mt-2" rounded="xl" />
        </div>
      </div>

      <div className="p-3 sm:p-4 pt-0">
        <CosmicSkeleton className="w-full h-9" rounded="xl" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const DashboardStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="galaxy-glass-card p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-purple-500/20 space-y-3"
        >
          <div className="flex items-center justify-between">
            <CosmicSkeleton className="w-20 h-3.5" rounded="md" />
            <CosmicSkeleton className="w-8 h-8" rounded="xl" />
          </div>
          <CosmicSkeleton className="w-28 h-7" rounded="lg" />
          <CosmicSkeleton className="w-36 h-3" rounded="md" />
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="galaxy-glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-purple-500/20 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
        <CosmicSkeleton className="w-32 h-5" rounded="md" />
        <CosmicSkeleton className="w-24 h-4" rounded="md" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 border-b border-purple-500/10 gap-3"
          >
            <CosmicSkeleton className="w-24 h-4" rounded="md" />
            <CosmicSkeleton className="w-32 h-4" rounded="md" />
            <CosmicSkeleton className="w-16 h-4" rounded="md" />
            <CosmicSkeleton className="w-20 h-6" rounded="lg" />
          </div>
        ))}
      </div>
    </div>
  );
};
