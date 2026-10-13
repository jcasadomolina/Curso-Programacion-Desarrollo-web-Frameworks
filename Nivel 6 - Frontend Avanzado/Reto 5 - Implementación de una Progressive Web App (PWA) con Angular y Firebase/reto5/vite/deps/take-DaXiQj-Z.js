import { Gl as operate, Kl as Observable, Wl as createOperatorSubscriber } from "./core-Dj4afQWF.js";
//#region node_modules/rxjs/dist/esm5/internal/observable/empty.js
var EMPTY = new Observable(function(subscriber) {
	return subscriber.complete();
});
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/operators/take.js
function take(count) {
	return count <= 0 ? function() {
		return EMPTY;
	} : operate(function(source, subscriber) {
		var seen = 0;
		source.subscribe(createOperatorSubscriber(subscriber, function(value) {
			if (++seen <= count) {
				subscriber.next(value);
				if (count <= seen) subscriber.complete();
			}
		}));
	});
}
//#endregion
export { EMPTY as n, take as t };
