import { Event, eventEmitter } from '@/lib/events';
import { useCallback, useEffect } from 'react';

// Hook to emit events
export function useEmitter() {
  return useCallback((event: Event, payload: any) => {
    eventEmitter.emit(event, payload);
  }, []);
}

// Hook to listen for events
export function useEvent(event: Event, callback: (...args: any[]) => void) {
  useEffect(() => {
    eventEmitter.on(event, callback);
    return () => {
      eventEmitter.off(event, callback);
    };
  }, [event, callback]);
}
