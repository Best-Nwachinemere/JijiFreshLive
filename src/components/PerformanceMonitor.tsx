import React, { useEffect, useState } from 'react';
import { Activity, Zap, Clock } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  connectionType: string;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    const measurePerformance = () => {
      // Get navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.navigationStart;
      const renderTime = navigation.domContentLoadedEventEnd - navigation.navigationStart;

      // Get memory usage (if available)
      const memory = (performance as any).memory;
      const memoryUsage = memory ? memory.usedJSHeapSize / 1024 / 1024 : 0;

      // Get connection info (if available)
      const connection = (navigator as any).connection;
      const connectionType = connection ? connection.effectiveType : 'unknown';

      setMetrics({
        loadTime: Math.round(loadTime),
        renderTime: Math.round(renderTime),
        memoryUsage: Math.round(memoryUsage * 100) / 100,
        connectionType
      });
    };

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Show metrics in development
    if (process.env.NODE_ENV === 'development') {
      setShowMetrics(true);
    }

    return () => {
      window.removeEventListener('load', measurePerformance);
    };
  }, []);

  // Log performance issues
  useEffect(() => {
    if (metrics) {
      if (metrics.loadTime > 3000) {
        console.warn('Slow page load detected:', metrics.loadTime + 'ms');
      }
      if (metrics.memoryUsage > 50) {
        console.warn('High memory usage detected:', metrics.memoryUsage + 'MB');
      }
    }
  }, [metrics]);

  if (!showMetrics || !metrics) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="flex items-center space-x-2 mb-2">
        <Activity className="w-4 h-4" />
        <span className="font-semibold">Performance</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Clock className="w-3 h-3" />
          <span>Load: {metrics.loadTime}ms</span>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="w-3 h-3" />
          <span>Render: {metrics.renderTime}ms</span>
        </div>
        <div>Memory: {metrics.memoryUsage}MB</div>
        <div>Connection: {metrics.connectionType}</div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;