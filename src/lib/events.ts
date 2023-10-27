import { EventEmitter } from 'events';

export type Event = 'scrollDownClicked' | 'credit_topup' | 'logged_out' | 'notebook_cache';

// Create a single shared event emitter instance
export const eventEmitter = new EventEmitter();

export function emitEvent(event: Event, payload?: any) {
  eventEmitter.emit(event, payload);
}
