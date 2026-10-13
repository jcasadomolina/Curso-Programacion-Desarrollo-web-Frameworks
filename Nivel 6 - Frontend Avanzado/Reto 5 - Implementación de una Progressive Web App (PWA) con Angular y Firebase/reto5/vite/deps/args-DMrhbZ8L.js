import { tu as isFunction } from "./core-Dj4afQWF.js";
import { a as isScheduler } from "./from-WQNjmZdV.js";
//#region node_modules/rxjs/dist/esm5/internal/util/args.js
function last(arr) {
	return arr[arr.length - 1];
}
function popResultSelector(args) {
	return isFunction(last(args)) ? args.pop() : void 0;
}
function popScheduler(args) {
	return isScheduler(last(args)) ? args.pop() : void 0;
}
function popNumber(args, defaultValue) {
	return typeof last(args) === "number" ? args.pop() : defaultValue;
}
//#endregion
export { popResultSelector as n, popScheduler as r, popNumber as t };
