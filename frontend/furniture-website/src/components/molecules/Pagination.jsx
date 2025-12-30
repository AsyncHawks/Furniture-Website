const Pagination = ({ pagination, onPageChange, currentPage }) => {
  const { totalPages } = pagination;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 my-6 w-full">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-gray-500 rounded disabled:opacity-40 cursor-pointer"
      >
        First
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-gray-500 rounded disabled:opacity-40 cursor-pointer"
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border border-gray-500 rounded ${
            currentPage === page
              ? 'bg-gray-900 text-white pointer-events-none'
              : 'hover:bg-gray-200 cursor-pointer'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-gray-500 rounded disabled:opacity-40 cursor-pointer"
      >
        Next
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-gray-500 rounded disabled:opacity-40 cursor-pointer"
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
