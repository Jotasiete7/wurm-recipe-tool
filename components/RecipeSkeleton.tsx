

interface RecipeSkeletonProps {
    count?: number;
}

export default function RecipeSkeleton({ count = 6 }: RecipeSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className="bg-wurm-panel border border-wurm-border rounded p-4 animate-pulse"
                >
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-wurm-border/30 rounded" />
                        <div className="flex-1 space-y-2">
                            <div className="h-5 bg-wurm-border/30 rounded w-3/4" />
                            <div className="h-3 bg-wurm-border/20 rounded w-1/2" />
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <div className="h-5 w-20 bg-wurm-border/20 rounded-full" />
                        <div className="h-5 w-16 bg-wurm-border/20 rounded-full" />
                        <div className="h-5 w-24 bg-wurm-border/20 rounded-full" />
                    </div>

                    {/* Ingredients */}
                    <div className="space-y-2">
                        <div className="h-3 bg-wurm-border/20 rounded w-full" />
                        <div className="h-3 bg-wurm-border/20 rounded w-5/6" />
                    </div>
                </div>
            ))}
        </>
    );
}
