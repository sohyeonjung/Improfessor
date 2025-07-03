interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pageSize = 10; // 한 번에 보여줄 페이지 번호 개수
  const startPage = Math.floor((currentPage - 1) / pageSize) * pageSize + 1;
  const endPage = Math.min(startPage + pageSize - 1, totalPages);
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className="flex justify-center items-center gap-6 mt-8">
      <button
        onClick={() => onPageChange(Math.max(1, startPage - pageSize))}
        disabled={startPage === 1}
        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        &lt;&lt;
      </button>

      <div className="flex items-center gap-4">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`text-lg transition-colors ${
              currentPage === page
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, startPage + pageSize))}
        disabled={endPage === totalPages}
        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        &gt;&gt;
      </button>
    </div>
  );
} 