import { t as from } from "./from-WQNjmZdV.js";
import { r as popScheduler } from "./args-DMrhbZ8L.js";
//#region node_modules/rxjs/dist/esm5/internal/observable/of.js
function of() {
	var args = [];
	for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
	var scheduler = popScheduler(args);
	return from(args, scheduler);
}
//#endregion
export { of as t };
