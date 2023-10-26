import { useEffect } from 'react';

export function useTrackPage(pagePath?: string): void {
  useEffect(() => {
    // @ts-ignore
    if (window.gtag) {
      // @ts-ignore
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: pagePath || window.location.pathname,
      });
    }
  }, [pagePath]);
}

type EventParams = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  send_to?: string;
};

export function trackEvent({
  action,
  category,
  label,
  value,
  send_to,
}: EventParams): void {
  // @ts-ignore
  if (window.gtag) {
    // @ts-ignore
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      send_to: send_to
    });
  }
}
