export function isImageFile(filename: string): boolean {
	return filename != null && !!filename.match(/.(jpg|jpeg|png|gif)$/i);
}

export function isNonRenderableImageFile(filename: string): boolean {
	return filename != null && !!filename.match(/.(tif|tiff)$/i);
}

export function isAudioFile(filename: string): boolean {
	return filename != null && !!filename.match(/.(mp3|wav|ogg)$/i);
}

export function isVideo(url: string): boolean {
	if (!url) return false;
	const r = /(.mp4|.avi|.3gpp|.mov|.webm|.mpeg|.ogg)$/;
	return r.test(url.toLowerCase());
}

export function filename2angle(filename: string) {
	if (!filename) return null;
	const match = filename.match(/^[0-9]*-[0-9]*-/g);
	if (match == null || match.length == 0) return null;
	const m = match[0];
	const sub = filename.substring(m.length);
	return sub.replace(/\.[^/.]+$/, '');
}

export function generateRandomText(): string {
	const randomText = (): string => Math.random().toString(36).slice(2);

	return [randomText(), randomText()].join('');
}

export function encapsulateIntoSection(html: any) {
	const section = document.createElement('section');
	section.innerHTML = html.trim();

	return section;
}

export function encapsulateFilesInFormData(
	files: FileList,
	key: string,
): FormData {
	let formData = new FormData();
	const activateCounting: boolean = files?.length > 1;

	Array.from(files).forEach((file, i) =>
		formData.append(!activateCounting ? key : `${key}-${i + 1}`, file),
	);

	return formData;
}

export function removeBreakAndSpaces(value: string): string {
	return !value?.length || value === ''
		? ''
		: value.trim().replace(/\n\s{2,}/gm, '');
}

export const splitMediaQuery: RegExp = /\)\s+/g;
export const responsiveImageMediaQueryRegex: RegExp =
	/(\([max|min|orientation].+\))\s(.+)/i;

export function queryImageDimenions(
	url: string,
	natural?: boolean,
): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		const divId = generateRandomText();
		const div = document.createElement('DIV');

		// referenced to be removed later
		div.id = divId;

		// ensure no flashing content
		div.style.opacity = '0';
		div.style.visibility = 'hidden';

		const img: HTMLImageElement = document.createElement(
			'IMG',
		) as HTMLImageElement;

		img.id = generateRandomText();
		img.src = url;
		img.style.display = 'block';
		img.onload = (e) => {
			let element: HTMLImageElement = e.target as HTMLImageElement;
			let { offsetWidth: width, offsetHeight: height } =
				element || <HTMLImageElement>{};

			if (natural) {
				width = element.naturalWidth;
				height = element.naturalHeight;
			}

			document.getElementById(divId)?.remove();
			return resolve({ width, height });
		};

		img.onerror = (e) => reject(e);

		// append image to div
		div.appendChild(img);

		// append div to body
		return document.body.appendChild(div);
	});
}

export function query(selector: string, el?: HTMLElement): any {
	return !el ? document.querySelector(selector) : el.querySelector(selector);
}

export function whenElement(selector: string): Promise<HTMLElement> {
	return new Promise((resolve) => {
		if (query(selector)) return resolve(query(selector));

		const observer = new MutationObserver((mutations) => {
			if (query(selector)) {
				resolve(query(selector));
				observer.disconnect();
			}
		});

		return observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
}

export function untilEvent(event: string): Promise<any> {
	return new Promise((resolve) =>
		window.addEventListener(event, (e: any) => resolve(e?.detail)),
	);
}

export function listify(selector: string, el?: HTMLElement) {
	return !el
		? Array.from(document.querySelectorAll(selector))
		: Array.from(el.querySelectorAll(selector));
}

export interface InjectScriptTagInterface {
	isAsync?: boolean;
	tagId?: any;
	idPrefix?: string;
}

export function injectScriptTag(
	resourceUrl: string,
	opts?: InjectScriptTagInterface,
) {
	const { isAsync, tagId, idPrefix } = opts || {};
	const el: HTMLScriptElement = document.createElement(
		'SCRIPT',
	) as HTMLScriptElement;

	el.src = resourceUrl;
	el.id =
		tagId ||
		(idPrefix
			? `${idPrefix}-${generateRandomText()}`
			: generateRandomText());

	if (isAsync) el.async = true;

	document.head.appendChild(el);

	return el;
}

export const wistiaIframeTagRegex =
	/\<iframe\s+src\=\".*?\.wistia.+\<\/iframe>/gm;
export const wistiaVideoIdRegex = /fast\.wistia\.net\/embed\/iframe\/([\S]+)\?/;

export function supportWistiaPopover(page: string): string {
	try {
		return page.slice().replace(wistiaIframeTagRegex, (m) => {
			const [_, videoId] = m.match(wistiaVideoIdRegex) || [];

			//return m.replace(m, `${m}<span class="wistia_embed wistia_async_${videoId} popover=true popoverContent=link"><button></button></span>`);
			return `<div class="wistia_embed wistia_async_${videoId} embed-responsive-item"></div>`;
		});
	} catch (e) {
		return page;
	}
}

export function triggerWindowResize() {
	try {
		// cross-browser compatible
		const resizeEvent: any = window.document.createEvent('UIEvents') as any;
		(resizeEvent as any).initUIEvent('resize', true, false, window, 0);

		return window.dispatchEvent(resizeEvent);
	} catch (e) {
		// for modern browsers
		return window.dispatchEvent(new Event('resize'));
	}
}

export function dataPlaceholderRegex(key: string): RegExp {
	return new RegExp(`\{\{\s*?${key}\s*?\}\}`, 'g');
}

export function elementBelongsTo(_parent: any, _child: any): boolean {
	if (_parent === _child) return !0;

	while (_child && _child !== _parent) {
		_child = _child.parentNode;
	}

	return _child === _parent;
}

export function ngForTrackByFn(attr?: string) {
	if (!attr)
		return function refactoredUtilityFn(i: number) {
			return i;
		};
	return function refactoredUtilityFn(_: any, item: any) {
		return !!item && item[attr];
	};
}

export interface ReduceProperty {
	property: string;
	as: string;
	collection: any[];
	collectionProperty: string;
}

export function isNil(value: any): boolean {
	return value === null || value === undefined;
}

export function reduceProperties(
	object: any,
	brackets: ReduceProperty[],
	matchingAttribute?: string,
): any {
	if (!isNil(object)) {
		if (brackets?.length) {
			try {
				// todo map multiple values if brackets[n][property] is an array
				return brackets.reduce((a, c) => {
					let {
						property,
						as,
						collection = [],
						collectionProperty,
					} = c || {};
					let found =
						collection?.find(
							(a) =>
								a[matchingAttribute || 'id'] ===
								object[property],
						) || {};

					return {
						...a,
						[as || property]: found[collectionProperty],
					};
				}, object);
			} catch (e) {
				return object;
			}
		}
	}

	return object;
}

export function randomInt(min: number, max: number): number {
	const _min = Math.ceil(min);
	const _max = Math.floor(max);

	return Math.floor(Math.random() * (_max - _min + 1)) + min;
}

export function setCookie(name: string, value: any, days: number): void {
	let expires = '';
	if (days) {
		let date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = '; expires=' + date.toUTCString();
	}
	document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

export function getCookie(name: string): string | null {
	let nameEQ = name + '=';
	let ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

export function arrayInt(length: number): Array<number> {
	return Array.from({ length }).map((_, index) => index);
}

export function shuffleArray(array: any[]): any[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

export function partiallyVisibleInViewport(element: HTMLElement): boolean {
	if (!element) return false;
	if (1 !== element.nodeType) return false;

	var html = document.documentElement;
	var rect = element.getBoundingClientRect();

	return (
		!!rect &&
		rect.bottom >= 0 &&
		rect.right >= 0 &&
		rect.left <= html.clientWidth &&
		rect.top <= html.clientHeight
	);
}

export function elementHeightInViewport(
	item: HTMLElement,
	parent: HTMLElement,
): number {
	let elH = item.clientHeight;
	let H = parent.clientHeight ?? innerHeight;
	let r = item.getBoundingClientRect();
	let t = r.top;
	let b = r.bottom;

	return Math.max(0, t > 0 ? Math.min(elH, H - t) : Math.min(b, H));
}

export function getAttributeOf(
	item: HTMLElement,
	attr: string,
	defaultValue: number,
): number {
	let value: any = item.dataset[attr] ?? defaultValue;
	try {
		if (!isNil(attr)) value = parseFloat(value);
	} catch (e) {
		value = defaultValue;
	}
	return value;
}

export function dispatchEvent(key: string, detail?: any, el?: any) {
	return (el || window).dispatchEvent(new CustomEvent(key, { detail }));
}

export function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function arrayTransformLastIsFirst(a: any[]): any[] {
	let b = a.slice();
	b = [...b.slice(-1), ...b.slice(0, b.length - 1)];

	return b;
}

export function queryVideoAspectRatio(
	url: string,
	dimensions?: boolean,
): Promise<{
	ratio: string;
	width: number;
	height: number;
}> {
	return new Promise((resolve, reject) => {
		const divId = generateRandomText();
		const div = document.createElement('DIV');

		// referenced to be removed later
		div.id = divId;

		// ensure no flashing content
		div.style.opacity = '0';
		div.style.visibility = 'hidden';

		const video: HTMLVideoElement = document.createElement(
			'VIDEO',
		) as HTMLVideoElement;

		video.id = generateRandomText();
		video.src = url;
		video.style.display = 'block';
		video.onloadeddata = (e) => {
			let element: HTMLVideoElement = e.target as HTMLVideoElement;
			let width = element.videoWidth;
			let height = element.videoHeight;

			document.getElementById(divId)?.remove();
			return resolve({
				width,
				height,
				ratio: (width / height).toFixed(1),
			});
		};

		video.onerror = (e) => reject(e);

		// append image to div
		div.appendChild(video);

		// append div to body
		return document.body.appendChild(div);
	});
}

// retain logic in one place
export function isChinaOrigin(): boolean {
	return (
		window.location.host.indexOf('ecco.cn') !== -1 ||
		window.location.host.indexOf('cn.eccocp') !== -1
	);
}

export function generateFragmentedDocument(content: string): any {
	try {
		let fragment = document.createDocumentFragment();
		let body = document.createElement('body');

		// define body
		fragment.appendChild(body);

		// load page markup
		body.innerHTML = content;

		return body;
	} catch (e) {
		return null;
	}
}

export function handle(value: string): string {
	let str = (value || 0).toString().toLowerCase();
	const toReplace: string[] = ['"', "'", '\\', '(', ')', '[', ']'];

	// For the old browsers
	for (let i = 0; i < toReplace.length; ++i) {
		str = str.replace(toReplace[i], '');
	}

	str = str.replace(/\W+/g, '-');

	if (str.charAt(str.length - 1) == '-') {
		str = str.replace(/-+\z/, '');
	}

	if (str.charAt(0) === '-') {
		str = str.replace(/\A-+/, '');
	}
	return str;
}

export function titleCase(item: string): string {
	return item.replace(
		/\w\S*/g,
		(txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
	);
}

export function ratioCalculator(ratio: string, base: number): number {
	let f = 0;
	if (ratio?.length) {
		if (ratio.match('1x1')) {
			f = base;
		} else if (ratio.match('2x1')) {
			f = Math.floor(base / 2);
		} else if (ratio.match('16x9')) {
			f = Math.floor((base / 16) * 9);
		} else if (ratio.match('4x5')) {
			f = Math.floor((base / 4) * 5);
		} else if (ratio.match('5x4')) {
			f = Math.floor((base / 5) * 4);
		} else if (ratio.match('9x16')) {
			f = Math.floor((base / 9) * 16);
		} else if (ratio.match('1x2')) {
			f = Math.floor((base / 1) * 2);
		} else if (ratio.match('21x9')) {
			f = Math.floor((base / 21) * 9);
		} else if (ratio.match('9x21')) {
			f = Math.floor((base / 9) * 21);
		} else if (ratio.match('4x3')) {
			f = Math.floor((base / 4) * 3);
		} else if (ratio.match('3x4')) {
			f = Math.floor((base / 3) * 4);
		}
	}
	return f;
}

export function splitComma(value: string): string[] {
	return (value || '')?.split(/\,\s?/g) ?? [];
}

export function hyphenate(camelized: any) {
	return camelized?.replace(/[A-Z]/g, (m: any) => '-' + m.toLowerCase());
}

export function camelizeHyphenated(hyphenated: any) {
	return hyphenated.replace(/-([a-z])/g, (g: any) => g[1].toUpperCase());
}

export function getCss(
	hyphenatedAttr: any,
	element = document.documentElement,
) {
	try {
		let source = getComputedStyle(element);
		if (hyphenatedAttr?.length) {
			return getComputedStyle(element)[
				camelizeHyphenated(hyphenatedAttr)
			];
		}
		return source;
	} catch (e) {
		return getComputedStyle(element);
	}
}

export function getCssInt(context: any, ...args: any): any {
	try {
		return parseInt(getCss.apply(context, args) as any);
	} catch (e) {
		return getCss.apply(context, args);
	}
}

export function getCssVariable(context: any, cssVariable: any): string {
	return (getCss(context) as CSSStyleDeclaration)?.getPropertyValue(
		cssVariable,
	);
}

// keep nunber in range []
// x should be between 10 - 100
export function cap(x: number, min?: number, max?: number): number {
	let p = x;
	if (min && p < min) p = min;
	if (max && p > max) p = max;
	return p;
}

export function getInteger(value: any, fallback: number): number {
    value = +(value ?? fallback);
    if (isNil(value) || isNaN(value)) value = fallback;
    return value;
}

export function getDateOfIsoWeek(week: any, year: any): Date {
    week = parseFloat(week);
    year = parseFloat(year);

    if (week < 1 || week > 53) {
        throw new RangeError("ISO 8601 weeks are numbered from 1 to 53");
    } else if (!Number.isInteger(week)) {
        throw new TypeError("Week must be an integer");
    } else if (!Number.isInteger(year)) {
        throw new TypeError("Year must be an integer");
    }

    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dayOfWeek = simple.getDay();
    const isoWeekStart = simple;

    // Get the Monday past, and add a week if the day was
    // Friday, Saturday or Sunday.

    isoWeekStart.setDate(simple.getDate() - dayOfWeek + 1);
    if (dayOfWeek > 4) {
        isoWeekStart.setDate(isoWeekStart.getDate() + 7);
    }

    // The latest possible ISO week starts on December 28 of the current year.
    if (isoWeekStart.getFullYear() > year ||
        (isoWeekStart.getFullYear() == year &&
            isoWeekStart.getMonth() == 11 &&
            isoWeekStart.getDate() > 28)) {
        throw new RangeError(`${year} has no ISO week ${week}`);
    }

    return isoWeekStart;
}

export function domElementsOverlap(a: HTMLElement, b: HTMLElement): boolean {
    const rect1 = a.getBoundingClientRect();
    const rect2 = b.getBoundingClientRect();
    const isInHoriztonalBounds = rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
    const isInVerticalBounds = rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
    const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;

    return isOverlapping;
}

export function readHorizontalOverlapFor(a: HTMLElement, b: HTMLElement): number[] {
    const rect1 = a.getBoundingClientRect();
    const rect2 = b.getBoundingClientRect();
    return [rect1.x - (rect2.x + rect2.width), (rect1.x + rect1.width) - rect2.x];
}

export function readVerticalOverlapFor(a: HTMLElement, b: HTMLElement): number[] {
    const rect1 = a.getBoundingClientRect();
    const rect2 = b.getBoundingClientRect();
    return [rect1.y - (rect2.y + rect2.height) , (rect1.y + rect1.height) - rect2.y];
}

export function getDomAttributeInteger(element: any, attribute: any): number {
    let value: any = 0;
    const computed = window.getComputedStyle(element);
    if (attribute in computed) {
        value = computed[attribute]?.replace('px', '');
        value = +value;
        if (isNaN(value)) value = 0;
    }
    return value;
}

export function withinRange(x: number, min: number, max: number): boolean {
    return x >= min && x <= max;
}


export function getDTValue(dt: DataTransfer, type: string = 'text/plain'): any {
	try {
		return JSON.parse(dt.getData(type));
	} catch(e) {
		return null;
	}
}