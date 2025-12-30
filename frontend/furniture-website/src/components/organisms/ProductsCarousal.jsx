import { useEffect, useRef, useState, useCallback } from 'react';
import { ProductCard, Heading } from '@components';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductsCarousal = ({ title, products = [] }) => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const productRefs = useRef([]);
  const autoTimer = useRef(null);
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const AUTO_INTERVAL_MS = 4000;

  const computeItemsPerView = useCallback(() => {
    const w = window.innerWidth;
    if (w >= 1100) return 4;
    if (w >= 820) return 3;
    if (w >= 520) return 2;
    return 1;
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const el = sectionRef.current;

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.01,
    });

    observer.observe(el);

    return () => observer.unobserve(el);
  }, []);

  useEffect(() => {
    const update = () => {
      setItemsPerView((prev) => {
        const next = computeItemsPerView();
        return prev === next ? prev : next;
      });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, [computeItemsPerView]);

  useEffect(() => {
    const maxIndex = Math.max(0, products.length - itemsPerView);
    if (index > maxIndex) setIndex(maxIndex);
  }, [itemsPerView, products.length, index]);

  const scrollToIndex = useCallback(
    (targetIndex, smooth = true) => {
      if (!containerRef.current) return;
      const container = containerRef.current;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const maxIndex = Math.max(0, products.length - itemsPerView);

      if (targetIndex >= maxIndex) {
        container.scrollTo({
          left: maxScrollLeft,
          behavior: smooth ? 'smooth' : 'auto',
        });
        return;
      }

      const targetNode = productRefs.current[targetIndex];
      if (!targetNode) return;

      const containerRect = container.getBoundingClientRect();
      const targetRect = targetNode.getBoundingClientRect();
      const offset = targetRect.left - containerRect.left + container.scrollLeft;

      container.scrollTo({
        left: Math.max(0, offset),
        behavior: smooth ? 'smooth' : 'auto',
      });
    },
    [products.length, itemsPerView]
  );

  useEffect(() => {
    const t = setTimeout(() => scrollToIndex(index), 40);
    return () => clearTimeout(t);
  }, [index, scrollToIndex]);

  useEffect(() => {
    const canAuto = products.length > itemsPerView;
    if (!canAuto || isHovered || !inView) return;

    if (autoTimer.current) {
      clearInterval(autoTimer.current);
      autoTimer.current = null;
    }

    const maxIndex = Math.max(0, products.length - itemsPerView);

    if (index >= maxIndex) return;

    autoTimer.current = setInterval(() => {
      setIndex((prev) => {
        const max = Math.max(0, products.length - itemsPerView);
        if (prev >= max) {
          clearInterval(autoTimer.current);
          autoTimer.current = null;
          return prev;
        }
        return prev + 1;
      });
    }, AUTO_INTERVAL_MS);

    return () => {
      if (autoTimer.current) {
        clearInterval(autoTimer.current);
        autoTimer.current = null;
      }
    };
  }, [isHovered, index, itemsPerView, products.length, inView]);

  const handlePrev = () => {
    setIndex((prev) => Math.max(0, prev - 1));
    if (autoTimer.current) {
      clearInterval(autoTimer.current);
      autoTimer.current = null;
    }
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, products.length - itemsPerView);
    setIndex((prev) => Math.min(maxIndex, prev + 1));
    if (autoTimer.current) {
      clearInterval(autoTimer.current);
      autoTimer.current = null;
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('keydown', onKey);

    return () => container.removeEventListener('keydown', onKey);
  }, [products.length, itemsPerView]);

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <section aria-label={title || 'Products carousel'} className="my-6">
        {title && (
          <Heading level={4} variant="secondary" className="">
            {title}
          </Heading>
        )}
        <div className="text-sm text-muted-foreground w-full text-center">No products to show.</div>
      </section>
    );
  }

  const maxIndex = Math.max(0, products.length - itemsPerView);
  const showNav = products.length > itemsPerView;

  return (
    <section ref={sectionRef} aria-label={title || 'Products carousel'} className="my-6">
      <div className="flex items-end justify-between mb-4">
        {title ? (
          <Heading level={4} variant="secondary" className="h-16">
            {title}
          </Heading>
        ) : (
          <span />
        )}
        {showNav ? (
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={index <= 0}
              aria-disabled={index <= 0}
              className={`px-3 py-1 cursor-pointer disabled:opacity-40 ${
                index <= 0 ? 'cursor-not-allowed' : ''
              }`}
              title="Previous"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={handleNext}
              disabled={index >= maxIndex}
              aria-disabled={index >= maxIndex}
              className={`px-3 py-1 cursor-pointer disabled:opacity-40 ${
                index >= maxIndex ? 'cursor-not-allowed' : ''
              }`}
              title="Next"
            >
              <ChevronRight />
            </button>
          </div>
        ) : null}
      </div>

      <div
        ref={containerRef}
        tabIndex={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className="relative overflow-hidden"
        style={{ outline: 'none' }}
      >
        <div
          className="flex gap-4 transition-transform ease-linear"
          style={{
            willChange: 'transform',
          }}
        >
          {products.map((p, i) => (
            <div
              key={p.id ?? i}
              ref={(el) => (productRefs.current[i] = el)}
              style={{ minWidth: `${100 / itemsPerView}%`, flex: `0 0 ${100 / itemsPerView}%` }}
              className="box-border"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

ProductsCarousal.propTypes = {
  title: PropTypes.string,
  products: PropTypes.array,
};

export default ProductsCarousal;
