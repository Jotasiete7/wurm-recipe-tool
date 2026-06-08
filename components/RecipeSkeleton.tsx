

interface RecipeSkeletonProps {
    count?: number;
}

export default function RecipeSkeleton({ count = 6 }: RecipeSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className="bg-wurm-panel border border-wurm-border rounded p-4 sm:p-5 animate-pulse h-[160px] flex flex-col justify-between"
                >
                    {/* Header */}
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-wurm-border/30 rounded" />
                        <div className="flex-1 space-y-2 min-w-0">
                            <div className="h-5 bg-wurm-border/30 rounded w-3/4" />
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                <div className="h-4 w-16 bg-wurm-border/20 rounded" />
                                <div className="h-4 w-12 bg-wurm-border/20 rounded" />
                                <div className="h-4 w-20 bg-wurm-border/20 rounded" />
                            </div>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="pl-16 space-y-2">
                        <div className="h-3 bg-wurm-border/20 rounded w-full" />
                        <div className="h-3 bg-wurm-border/20 rounded w-5/6" />
                    </div>
                </div>
            ))}
        </>
    );
}
