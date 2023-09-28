import { useCallback, useEffect } from 'react';

import { EventEmitter } from 'events';

type Event = 'scrollDownClicked';

// Create a single shared event emitter instance
const eventEmitter = new EventEmitter();

// Hook to emit events
export function useEmitter() {
  // Return a function that emits events
  return useCallback((event: Event, payload: any) => {
    eventEmitter.emit(event, payload);
  }, []);
}

// Hook to listen for events
export function useEvent(event: Event, callback: (...args: any[]) => void) {
  useEffect(() => {
    // Add the callback as an event listener
    eventEmitter.on(event, callback);

    // Clean up the listener when the component unmounts
    return () => {
      eventEmitter.off(event, callback);
    };
  }, [event, callback]);
}
