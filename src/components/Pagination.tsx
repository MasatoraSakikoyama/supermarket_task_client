interface PaginationProps {
  currentPage: number;
  hasMore: boolean;
  loading?: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export default function Pagination({
  currentPage,
  hasMore,
  loading = false,
  onPrevious,
  onNext,
}: PaginationProps) {
  return (
    <div className="bg-gray-50 px-4 py-3 flex items-center justify-center border-t border-gray-200">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentPage === 1 || loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasMore || loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}
