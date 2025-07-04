import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useInfiniteScroll = (
  callback: () => void,
  hasMore: boolean,
  options: UseInfiniteScrollOptions = {}
) => {
  const { threshold = 1.0, rootMargin = '0px' } = options;
  const [isFetching, setIsFetching] = useState(false);
  const [element, setElement] = useState<HTMLElement | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isFetching) {
          setIsFetching(true);
          callback();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [element, hasMore, isFetching, callback, threshold, rootMargin]);

  useEffect(() => {
    if (isFetching) {
      // Reset fetching state after callback
      const timer = setTimeout(() => setIsFetching(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isFetching]);

  return { ref, isFetching };
};