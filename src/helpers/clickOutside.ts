import { App, Directive } from "vue";

const clickOutside: Directive = {
	beforeMount: (el, binding) => {
		el.clickOutsideEvent = (event: PointerEvent) => {
			if (el == event.target) {
				binding.value();
			}
		};
		el.catchEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				binding.value();
			}
		};
		document.addEventListener("keydown", el.catchEscape);
		document.addEventListener("click", el.clickOutsideEvent);
	},
	unmounted: (el) => {
		document.removeEventListener("click", el.clickOutsideEvent);
		document.removeEventListener("keydown", el.catchEscape);
	},
};

export const clickOutsideDirective = (app: App): any => {
	app.directive("click-outside", clickOutside);
};
