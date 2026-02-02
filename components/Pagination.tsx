import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    loading?: boolean;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalCount,
    itemsPerPage,
    onPageChange,
    hasNextPage,
    hasPrevPage,
    loading = false,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const startItem = currentPage * itemsPerPage + 1;
    const endItem = Math.min((currentPage + 1) * itemsPerPage, totalCount);

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // Show all pages
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(0);

            if (currentPage > 2) {
                pages.push('...');
            }

            // Show pages around current
            const start = Math.max(1, currentPage - 1);
            const end = Math.min(totalPages - 2, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 3) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages - 1);
        }

        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-wurm-border">
            {/* Info */}
            <div className="text-xs text-wurm-muted font-mono">
                Showing <span className="text-wurm-accent font-bold">{startItem}</span> to{' '}
                <span className="text-wurm-accent font-bold">{endItem}</span> of{' '}
                <span className="text-wurm-accent font-bold">{totalCount}</span> recipes
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                    onClick={() => onPageChange(0)}
                    disabled={!hasPrevPage || loading}
                    className="p-2 rounded bg-wurm-panel border border-wurm-border text-wurm-muted hover:text-wurm-accent hover:border-wurm-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-wurm-muted disabled:hover:border-wurm-border"
                    title="First page"
                >
                    <ChevronsLeft size={16} />
                </button>

                {/* Previous Page */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrevPage || loading}
                    className="p-2 rounded bg-wurm-panel border border-wurm-border text-wurm-muted hover:text-wurm-accent hover:border-wurm-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-wurm-muted disabled:hover:border-wurm-border"
                    title="Previous page"
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNum, idx) => {
                        if (pageNum === '...') {
                            return (
                                <span key={`ellipsis-${idx}`} className="px-2 text-wurm-muted">
                                    ...
                                </span>
                            );
                        }

                        const page = pageNum as number;
                        const isActive = page === currentPage;

                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                disabled={loading}
                                className={`min-w-[32px] h-8 px-2 rounded text-xs font-mono transition-all ${isActive
                                    ? 'bg-wurm-accent text-black font-bold'
                                    : 'bg-wurm-panel border border-wurm-border text-wurm-text hover:border-wurm-accent hover:text-wurm-accent'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {page + 1}
                            </button>
                        );
                    })}
                </div>

                {/* Next Page */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage || loading}
                    className="p-2 rounded bg-wurm-panel border border-wurm-border text-wurm-muted hover:text-wurm-accent hover:border-wurm-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-wurm-muted disabled:hover:border-wurm-border"
                    title="Next page"
                >
                    <ChevronRight size={16} />
                </button>

                {/* Last Page */}
                <button
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={!hasNextPage || loading}
                    className="p-2 rounded bg-wurm-panel border border-wurm-border text-wurm-muted hover:text-wurm-accent hover:border-wurm-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-wurm-muted disabled:hover:border-wurm-border"
                    title="Last page"
                >
                    <ChevronsRight size={16} />
                </button>
            </div>
        </div>
    );
}
