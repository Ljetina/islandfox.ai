import { useCallback, useEffect } from 'react';

import { EventEmitter } from 'events';

type Event = 'scrollDownClicked';

// Create a single shared event emitter instance
const eventEmitter = new EventEmitter();

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
