import { Ac as InjectionToken, Di as provideAppInitializer, Fl as ɵɵinject, Fn as Injectable, Hl as require_cjs, Ml as ɵɵdefineInjector, Wi as setClassMetadata, ao as ɵɵdefineNgModule, fc as require_operators, fl as inject, jc as Injector, jl as ɵɵdefineInjectable, qc as RuntimeError, qn as NgModule, tn as ApplicationRef, vl as makeEnvironmentProviders } from "./core-C9KVzkVN.js";
//#region node_modules/@angular/service-worker/fesm2022/service-worker.mjs
/**
* @license Angular v22.2.2
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
var import_cjs = require_cjs();
var import_operators = require_operators();
var ERR_SW_NOT_SUPPORTED = "Service workers are disabled or not supported by this browser";
var NgswCommChannel = class {
	serviceWorker;
	worker;
	registration;
	events;
	constructor(serviceWorker, injector) {
		this.serviceWorker = serviceWorker;
		if (!serviceWorker) this.worker = this.events = this.registration = new import_cjs.Observable((subscriber) => subscriber.error(new RuntimeError(5601, (typeof ngDevMode === "undefined" || ngDevMode) && ERR_SW_NOT_SUPPORTED)));
		else {
			let currentWorker = null;
			const workerSubject = new import_cjs.Subject();
			this.worker = new import_cjs.Observable((subscriber) => {
				if (currentWorker !== null) subscriber.next(currentWorker);
				return workerSubject.subscribe((v) => subscriber.next(v));
			});
			const updateController = () => {
				const { controller } = serviceWorker;
				if (controller === null) return;
				currentWorker = controller;
				workerSubject.next(currentWorker);
			};
			serviceWorker.addEventListener("controllerchange", updateController);
			updateController();
			this.registration = this.worker.pipe((0, import_operators.switchMap)(() => serviceWorker.getRegistration().then((registration) => {
				if (!registration) throw new RuntimeError(5601, (typeof ngDevMode === "undefined" || ngDevMode) && ERR_SW_NOT_SUPPORTED);
				return registration;
			})));
			const _events = new import_cjs.Subject();
			this.events = _events.asObservable();
			const messageListener = (event) => {
				const { data } = event;
				if (data?.type) _events.next(data);
			};
			serviceWorker.addEventListener("message", messageListener);
			(injector?.get(ApplicationRef, null, { optional: true }))?.onDestroy(() => {
				serviceWorker.removeEventListener("controllerchange", updateController);
				serviceWorker.removeEventListener("message", messageListener);
			});
		}
	}
	postMessage(action, payload) {
		return new Promise((resolve) => {
			this.worker.pipe((0, import_operators.take)(1)).subscribe((sw) => {
				sw.postMessage({
					action,
					...payload
				});
				resolve();
			});
		});
	}
	postMessageWithOperation(type, payload, operationNonce) {
		const waitForOperationCompleted = this.waitForOperationCompleted(operationNonce);
		const postMessage = this.postMessage(type, payload);
		return Promise.all([postMessage, waitForOperationCompleted]).then(([, result]) => result);
	}
	generateNonce() {
		return Math.round(Math.random() * 1e7);
	}
	eventsOfType(type) {
		let filterFn;
		if (typeof type === "string") filterFn = (event) => event.type === type;
		else filterFn = (event) => type.includes(event.type);
		return this.events.pipe((0, import_operators.filter)(filterFn));
	}
	nextEventOfType(type) {
		return this.eventsOfType(type).pipe((0, import_operators.take)(1));
	}
	waitForOperationCompleted(nonce) {
		return new Promise((resolve, reject) => {
			this.eventsOfType("OPERATION_COMPLETED").pipe((0, import_operators.filter)((event) => event.nonce === nonce), (0, import_operators.take)(1), (0, import_operators.map)((event) => {
				if (event.result !== void 0) return event.result;
				throw new Error(event.error);
			})).subscribe({
				next: resolve,
				error: reject
			});
		});
	}
	get isEnabled() {
		return !!this.serviceWorker;
	}
};
var SwPush = class SwPush {
	sw;
	messages;
	notificationClicks;
	notificationCloses;
	pushSubscriptionChanges;
	subscription;
	get isEnabled() {
		return this.sw.isEnabled;
	}
	pushManager = null;
	subscriptionChanges = new import_cjs.Subject();
	constructor(sw) {
		this.sw = sw;
		if (!sw.isEnabled) {
			this.messages = import_cjs.NEVER;
			this.notificationClicks = import_cjs.NEVER;
			this.notificationCloses = import_cjs.NEVER;
			this.pushSubscriptionChanges = import_cjs.NEVER;
			this.subscription = import_cjs.NEVER;
			return;
		}
		this.messages = this.sw.eventsOfType("PUSH").pipe((0, import_operators.map)((message) => message.data));
		this.notificationClicks = this.sw.eventsOfType("NOTIFICATION_CLICK").pipe((0, import_operators.map)((message) => message.data));
		this.notificationCloses = this.sw.eventsOfType("NOTIFICATION_CLOSE").pipe((0, import_operators.map)((message) => message.data));
		this.pushSubscriptionChanges = this.sw.eventsOfType("PUSH_SUBSCRIPTION_CHANGE").pipe((0, import_operators.map)((message) => message.data));
		this.pushManager = this.sw.registration.pipe((0, import_operators.map)((registration) => registration.pushManager));
		const workerDrivenSubscriptions = this.pushManager.pipe((0, import_operators.switchMap)((pm) => pm.getSubscription()));
		this.subscription = new import_cjs.Observable((subscriber) => {
			const workerDrivenSubscription = workerDrivenSubscriptions.subscribe(subscriber);
			const subscriptionChanges = this.subscriptionChanges.subscribe(subscriber);
			return () => {
				workerDrivenSubscription.unsubscribe();
				subscriptionChanges.unsubscribe();
			};
		});
	}
	requestSubscription(options) {
		if (!this.sw.isEnabled || this.pushManager === null) return Promise.reject(/* @__PURE__ */ new Error(ERR_SW_NOT_SUPPORTED));
		const pushOptions = { userVisibleOnly: true };
		let key = this.decodeBase64(options.serverPublicKey.replace(/_/g, "/").replace(/-/g, "+"));
		let applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
		for (let i = 0; i < key.length; i++) applicationServerKey[i] = key.charCodeAt(i);
		pushOptions.applicationServerKey = applicationServerKey;
		return new Promise((resolve, reject) => {
			this.pushManager.pipe((0, import_operators.switchMap)((pm) => pm.subscribe(pushOptions)), (0, import_operators.take)(1)).subscribe({
				next: (sub) => {
					this.subscriptionChanges.next(sub);
					resolve(sub);
				},
				error: reject
			});
		});
	}
	unsubscribe() {
		if (!this.sw.isEnabled) return Promise.reject(/* @__PURE__ */ new Error(ERR_SW_NOT_SUPPORTED));
		const doUnsubscribe = (sub) => {
			if (sub === null) throw new RuntimeError(5602, (typeof ngDevMode === "undefined" || ngDevMode) && "Not subscribed to push notifications.");
			return sub.unsubscribe().then((success) => {
				if (!success) throw new RuntimeError(5603, (typeof ngDevMode === "undefined" || ngDevMode) && "Unsubscribe failed!");
				this.subscriptionChanges.next(null);
			});
		};
		return new Promise((resolve, reject) => {
			this.subscription.pipe((0, import_operators.take)(1), (0, import_operators.switchMap)(doUnsubscribe)).subscribe({
				next: resolve,
				error: reject
			});
		});
	}
	decodeBase64(input) {
		return atob(input);
	}
	static ɵfac = function SwPush_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || SwPush)(ɵɵinject(NgswCommChannel));
	};
	static ɵprov = /*@__PURE__*/ ɵɵdefineInjectable({
		token: SwPush,
		factory: SwPush.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SwPush, [{ type: Injectable }], () => [{ type: NgswCommChannel }], null);
})();
var SwUpdate = class SwUpdate {
	sw;
	versionUpdates;
	unrecoverable;
	get isEnabled() {
		return this.sw.isEnabled;
	}
	ongoingCheckForUpdate = null;
	constructor(sw) {
		this.sw = sw;
		if (!sw.isEnabled) {
			this.versionUpdates = import_cjs.NEVER;
			this.unrecoverable = import_cjs.NEVER;
			return;
		}
		this.versionUpdates = this.sw.eventsOfType([
			"VERSION_DETECTED",
			"VERSION_INSTALLATION_FAILED",
			"VERSION_READY",
			"NO_NEW_VERSION_DETECTED"
		]);
		this.unrecoverable = this.sw.eventsOfType("UNRECOVERABLE_STATE");
	}
	checkForUpdate() {
		if (!this.sw.isEnabled) return Promise.reject(/* @__PURE__ */ new Error(ERR_SW_NOT_SUPPORTED));
		if (this.ongoingCheckForUpdate) return this.ongoingCheckForUpdate;
		const nonce = this.sw.generateNonce();
		this.ongoingCheckForUpdate = this.sw.postMessageWithOperation("CHECK_FOR_UPDATES", { nonce }, nonce).finally(() => {
			this.ongoingCheckForUpdate = null;
		});
		return this.ongoingCheckForUpdate;
	}
	activateUpdate() {
		if (!this.sw.isEnabled) return Promise.reject(new RuntimeError(5601, (typeof ngDevMode === "undefined" || ngDevMode) && ERR_SW_NOT_SUPPORTED));
		const nonce = this.sw.generateNonce();
		return this.sw.postMessageWithOperation("ACTIVATE_UPDATE", { nonce }, nonce);
	}
	static ɵfac = function SwUpdate_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || SwUpdate)(ɵɵinject(NgswCommChannel));
	};
	static ɵprov = /*@__PURE__*/ ɵɵdefineInjectable({
		token: SwUpdate,
		factory: SwUpdate.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SwUpdate, [{ type: Injectable }], () => [{ type: NgswCommChannel }], null);
})();
var SCRIPT = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "NGSW_REGISTER_SCRIPT" : "");
function ngswAppInitializer() {}
function ngswCommChannelFactory() {
	inject(SwRegistrationOptions);
	return new NgswCommChannel(void 0, inject(Injector));
}
var SwRegistrationOptions = class {
	enabled;
	updateViaCache;
	type;
	scope;
	registrationStrategy;
};
function provideServiceWorker(script, options = {}) {
	return makeEnvironmentProviders([
		SwPush,
		SwUpdate,
		{
			provide: SCRIPT,
			useValue: script
		},
		{
			provide: SwRegistrationOptions,
			useValue: options
		},
		{
			provide: NgswCommChannel,
			useFactory: ngswCommChannelFactory
		},
		provideAppInitializer(ngswAppInitializer)
	]);
}
var ServiceWorkerModule = class ServiceWorkerModule {
	static register(script, options = {}) {
		return {
			ngModule: ServiceWorkerModule,
			providers: [provideServiceWorker(script, options)]
		};
	}
	static ɵfac = function ServiceWorkerModule_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || ServiceWorkerModule)();
	};
	static ɵmod = /*@__PURE__*/ ɵɵdefineNgModule({ type: ServiceWorkerModule });
	static ɵinj = /*@__PURE__*/ ɵɵdefineInjector({ providers: [SwPush, SwUpdate] });
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ServiceWorkerModule, [{
		type: NgModule,
		args: [{ providers: [SwPush, SwUpdate] }]
	}], null, null);
})();
//#endregion
export { ServiceWorkerModule, SwPush, SwRegistrationOptions, SwUpdate, provideServiceWorker };
