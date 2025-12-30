import {
  FilterBtn,
  SideBarOverlay,
  ProductsFilterSidebar,
  PriceFilter,
  Divider,
  AvailabilityFilter,
} from '@components';
import { productSortFilters } from '@config';
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const ProductsFilter = ({ filters, setParams }) => {
  const [sortFilterOpen, setSortFilterOpen] = useState(false);
  const [sideFilterOpen, setSideFilterOpen] = useState(false);
  const [selectedSortFilter, setSelectedSortFilter] = useState(filters.sort);

  const dropdownRef = useRef(null);

  const handleSortSelect = (filterValue) => {
    const newParams = new URLSearchParams(window.location.search);
    newParams.set('sort', filterValue);
    newParams.set('page', 1);
    setParams(newParams);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSortFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <SideBarOverlay isOpen={sideFilterOpen} onClose={() => setSideFilterOpen(false)} side="left">
        <ProductsFilterSidebar
          onClearParams={() => {
            const params = new URLSearchParams();
            setParams(params);
            setSelectedSortFilter('featured');
          }}
          onClose={() => {
            setSideFilterOpen(false);
          }}
        >
          <AvailabilityFilter filters={filters} setParams={setParams} />
          <div className="mb-2">
            <Divider />
          </div>
          <PriceFilter filters={filters} setParams={setParams} />
        </ProductsFilterSidebar>
      </SideBarOverlay>

      <div className="w-full flex flex-col sm:flex-row gap-4 justify-between">
        <div onClick={() => setSideFilterOpen(true)} className="w-full sm:w-1/2 lg:w-fit">
          <FilterBtn className="w-full" />
        </div>

        <div className="relative w-full sm:w-1/2 lg:w-fit" ref={dropdownRef}>
          <FilterBtn
            className="w-full"
            text={productSortFilters.find((f) => f.filter === selectedSortFilter).title}
            onClick={() => setSortFilterOpen(!sortFilterOpen)}
          />

          {sortFilterOpen && (
            <div className="absolute right-0 top-18 min-w-44 w-full bg-(--color-surface-300) border border-gray-400 z-10">
              {productSortFilters.map((filter, i) => (
                <div
                  className={`${filter.filter === selectedSortFilter ? 'bg-gray-300' : 'bg-(--color-surface-300)'} p-2 cursor-pointer hover:bg-gray-200`}
                  onClick={() => {
                    setSelectedSortFilter(filter.filter);
                    setSortFilterOpen(false);
                    handleSortSelect(filter.filter);
                  }}
                  key={i}
                >
                  {filter.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

ProductsFilter.propTypes = {
  filters: PropTypes.shape({
    sort: PropTypes.string.isRequired,
  }).isRequired,
  setParams: PropTypes.func.isRequired,
};

export default ProductsFilter;
