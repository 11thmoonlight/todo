function Pagination({ page, pageSize, totalItems, onPageChange }) {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <section className="container m-auto flex justify-center items-center my-8">
      <button
        disabled={page === 1}
        className="mr-2 px-2 py-1 border bg-stone-200 border-gray-300 rounded"
        onClick={() => handlePageChange(page - 1)}
      >
        Previous
      </button>
      <span className="mx-2">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        className="ml-2 px-2 py-1 border bg-stone-200 border-gray-300 rounded"
        onClick={() => handlePageChange(page + 1)}
      >
        Next
      </button>
    </section>
  );
}

export default Pagination;
