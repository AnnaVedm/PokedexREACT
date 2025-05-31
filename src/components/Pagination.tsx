import classNames from 'classnames';

const range = (start: number, end: number) =>
  Array.from({ length: end - start }, (_, i) => i + start);

const getPagesCut = ({
  pagesCount,
  pagesCutCount,
  currentPage,
}: {
  pagesCount: number;
  pagesCutCount: number;
  currentPage: number;
}) => {
  const ceiling = Math.ceil(pagesCutCount / 2);
  const floor = Math.floor(pagesCutCount / 2);

  if (pagesCount <= pagesCutCount) {
    return { start: 1, end: pagesCount + 1 };
  }

  if (currentPage <= ceiling) {
    return { start: 1, end: pagesCutCount + 1 };
  }

  if (currentPage + floor >= pagesCount) {
    return { start: pagesCount - pagesCutCount + 1, end: pagesCount + 1 };
  }

  return { start: currentPage - ceiling + 1, end: currentPage + floor + 1 };
};

interface PaginationItemProps {
  page: number | string;
  currentPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const PaginationItem = ({
  page,
  currentPage,
  onPageChange,
  disabled = false,
}: PaginationItemProps) => {
  const isActive = page === currentPage;
  const isControl = typeof page === 'string';

  const handleClick = () => {
    if (!disabled && !isActive && !isControl) {
      onPageChange(Number(page));
    }
    if (!disabled && isControl) {
    }
  };

  return (
    <li>
      <button
        className={classNames(
          'btn px-3 py-1 rounded border transition-colors',
          {
            'bg-blue-600 text-white hover:bg-blue-700': isActive,
            'opacity-50 cursor-not-allowed': disabled,
            'hover:bg-gray-200': !disabled && !isActive,
          }
        )}
        onClick={handleClick}
        disabled={disabled}
        type="button"
      >
        {page}
      </button>
    </li>
  );
};

interface PaginationProps {
  currentPage: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination = ({
  currentPage,
  total,
  limit,
  onPageChange,
  loading = false,
}: PaginationProps) => {
  if (loading) return null;

  const pagesCount = Math.ceil(total / limit);
  const { start, end } = getPagesCut({
    pagesCount,
    pagesCutCount: 5,
    currentPage,
  });

  const pages = range(start, end);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pagesCount;

  //Добавить кнопки первая и последняя страница в верстку
  return (
    <nav aria-label="Pagination Navigation" className="flex justify-center mt-4">
      <ul className="flex gap-2">
        <PaginationItem
          page="First"
          currentPage={currentPage}
          onPageChange={() => onPageChange(1)}
          disabled={isFirstPage}
        />
        <PaginationItem
          page="Prev"
          currentPage={currentPage}
          onPageChange={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={isFirstPage}
        />
        {pages.map((page) => (
          <PaginationItem
            key={page}
            page={page}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        ))}
        <PaginationItem
          page="Next"
          currentPage={currentPage}
          onPageChange={() => onPageChange(Math.min(currentPage + 1, pagesCount))}
          disabled={isLastPage}
        />
        <PaginationItem
          page="Last"
          currentPage={currentPage}
          onPageChange={() => onPageChange(pagesCount)}
          disabled={isLastPage}
        />
      </ul>
    </nav>
  );
};

export default Pagination;
