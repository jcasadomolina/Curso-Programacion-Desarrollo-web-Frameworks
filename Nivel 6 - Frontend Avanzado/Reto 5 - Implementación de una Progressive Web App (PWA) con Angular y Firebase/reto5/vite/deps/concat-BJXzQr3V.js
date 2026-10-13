import { Jl as identity } from "./core-Dj4afQWF.js";
import { t as from } from "./from-WQNjmZdV.js";
import { r as popScheduler } from "./args-DMrhbZ8L.js";
import { n as mergeMap } from "./concatMap-Dqs5esDU.js";
//#region node_modules/rxjs/dist/esm5/internal/operators/mergeAll.js
function mergeAll(concurrent) {
	if (concurrent === void 0) concurrent = Infinity;
	return mergeMap(identity, concurrent);
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/operators/concatAll.js
function concatAll() {
	return mergeAll(1);
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/concat.js
function concat() {
	var args = [];
	for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
	return concatAll()(from(args, popScheduler(args)));
}
//#endregion
export { mergeAll as n, concat as t };
