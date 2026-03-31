export type EventHandler = (evt?: Event | CustomEvent) => void;

export type EventSubscriber = (additionalCallback: (evt?: Event | CustomEvent) => void) => void;

function createEventHandler(
	callback?: (evt?: Event | CustomEvent) => void,
): readonly [EventHandler, EventSubscriber] {
	const additionalCallbacks = [] as EventHandler[];

	const onEvent: EventSubscriber = (additionalCallback) => {
		additionalCallbacks.push(additionalCallback);
	};

	const handleEvent: EventHandler = (evt) => {
		callback?.(evt);
		additionalCallbacks.forEach((c) => c(evt));
	};

	return [handleEvent, onEvent];
}

export default createEventHandler;
