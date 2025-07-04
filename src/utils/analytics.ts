interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean = true;

  constructor() {
    // Check if analytics is enabled (respect user privacy)
    this.isEnabled = localStorage.getItem('analytics-enabled') !== 'false';
  }

  track(name: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: new Date()
    };

    this.events.push(event);
    
    // Store in localStorage for offline support
    this.persistEvents();
    
    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(event);
    } else {
      console.log('Analytics Event:', event);
    }
  }

  private persistEvents() {
    try {
      localStorage.setItem('analytics-events', JSON.stringify(this.events.slice(-100))); // Keep last 100 events
    } catch (error) {
      console.error('Failed to persist analytics events:', error);
    }
  }

  private async sendToAnalytics(event: AnalyticsEvent) {
    try {
      // Replace with your analytics endpoint
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // User engagement tracking
  trackPageView(page: string) {
    this.track('page_view', { page });
  }

  trackUserAction(action: string, details?: Record<string, any>) {
    this.track('user_action', { action, ...details });
  }

  trackPurchase(itemId: string, price: number, currency = 'NGN') {
    this.track('purchase', { itemId, price, currency });
  }

  trackSearch(query: string, resultsCount: number) {
    this.track('search', { query, resultsCount });
  }

  trackListingView(listingId: string, category: string) {
    this.track('listing_view', { listingId, category });
  }

  // Performance tracking
  trackPerformance(metric: string, value: number, unit: string) {
    this.track('performance', { metric, value, unit });
  }

  // Error tracking
  trackError(error: Error, context?: string) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      context
    });
  }

  // Privacy controls
  enableAnalytics() {
    this.isEnabled = true;
    localStorage.setItem('analytics-enabled', 'true');
  }

  disableAnalytics() {
    this.isEnabled = false;
    localStorage.setItem('analytics-enabled', 'false');
    this.events = [];
    localStorage.removeItem('analytics-events');
  }

  getEvents() {
    return this.events;
  }
}

export const analytics = new Analytics();