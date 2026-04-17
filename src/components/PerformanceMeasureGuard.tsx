'use client';

import { useEffect } from 'react';

export function PerformanceMeasureGuard() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('performance' in window)) return;
    if (typeof performance.measure !== 'function') return;

    const original = performance.measure.bind(performance);

    // Guard against runtime errors when a dependency calls performance.measure()
    // with invalid timing values (e.g. negative `end`).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    performance.measure = ((name: string, startOrOptions?: any, endMark?: any) => {
      try {
        if (startOrOptions && typeof startOrOptions === 'object' && ('end' in startOrOptions || 'start' in startOrOptions)) {
          const next = { ...startOrOptions };
          if (typeof next.start === 'number' && next.start < 0) next.start = 0;
          if (typeof next.end === 'number' && next.end < 0) next.end = 0;
          return original(name, next);
        }
        return original(name, startOrOptions as never, endMark as never);
      } catch {
        return;
      }
    }) as Performance['measure'];

    return () => {
      performance.measure = original as Performance['measure'];
    };
  }, []);

  return null;
}

