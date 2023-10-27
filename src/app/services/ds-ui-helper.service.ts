import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { hyphenate } from '../helpers';
import { environment } from 'src/environments/environment';
import { DataExService } from './data-ex.service';
import { UiService } from './ui.service';

@Injectable({
	providedIn: 'root',
})
export class DsUiHelperService {
	constructor(
		private dx: DataExService,
		private ui: UiService,
	) {}

	getProductImageCode(product: any) {
		const code = product.code;
		return code.slice(0, 6) + '-' + code.slice(6, 11);
	}

	private getFormatKey(url: any, options: any) {
		let ext = options.format
			? `${options.format}`
			: url.slice(url.length - 3);
		if (ext == 'tif') ext = 'jpg';
		const size = options.size ? `__${options.size}` : '';

		return `${ext}${size}`;
	}

	getCachedUrl(asset: any, size = null, format = null, _url = null) {
		// If we want to piggyback on some other system cache
		if (this.ui.settingsMap['cache.rebase']) {
			const filename = `${this.getProductImageCode(
				this.dx.productsMap[asset.productId],
			)}-${asset.angle}`;
			const newUrl = `${this.ui.settingsMap['cache.rebase']}${filename}__512.png`;
			return newUrl;
		}

		const url = _url ? _url : asset.url;

		// No cache enabled, just use URL (bad for EDAM direct links)
		if (!this.ui.getSettingBool('cache.enabled')) {
			return url;
		}

		// svg fix ?
		//if(url.toLowerCase().endsWith('.svg')) return url;

		//https://eccods.blob.core.windows.net/cached2/050144-00101-outside__512.png

		// Check if we have direct url to cached file
		const key = this.getFormatKey(url, { format: format, size: size });

		if (asset.cached && asset.cached[key]) {
			if (false) {
				return asset.cached[key].replace(
					'eccocpeu.blob.core.windows.net',
					'eccocpcn.blob.core.chinacloudapi.cn',
				);
			}

			return asset.cached[key];
		}

		// qfix, so no server freeze
		if (this.ui.settingsMap['cache.nogenerate']) {
			return null;
		}

		//return 'https://eccocpeu.blob.core.windows.net/icons/no-image-sync.png'; // makes more sense

		// Use API otherwise - disabled as can and will be handled on server side, only for debug and when issues
		return (
			'/api/assets/cached?url=' +
			url +
			(size ? `&size=${size}` : '') +
			(format ? `&format=${format}` : '')
		);
	}

	getThumbAngles(product: any, options: any = {}) {
		let angles = options.angle ? [options.angle] : ['thumb'];

		const mixCode = product.targetGroupId
			? this.dx.maps['targetGroup'][product.targetGroupId]?.mixCode
			: '-';

		// console.log(product.code, product.targetGroupId ,mixCode);

		switch (mixCode) {
			case 'sra':
				angles.push('main');
				break;

			case 'bags':
			case 'vm':
				angles.push('front');
				break;

			default:
				angles.push('outside');
		}

		angles.push('main');

		return angles;
	}

	getThumbEx(product: any, options: any = {}) {
		// Remove inactive
		const assets = product?.assets?.filter((a: any) => a.isActive);

		if (assets && assets.length) {
			// Create angles hierarchy
			const angles = this.getThumbAngles(product, options);

			// Check if we have one of the angles

			for (const angle of angles) {
				// If we have `thumb` we assume it's prepared and that's what we need
				let asset = assets.find(
					(x: any) => x.angle == angle && !x.quality,
				);
				if (asset)
					return this.getCachedUrl(
						asset,
						options.size ?? 512,
						options.format ?? 'png',
					);

				asset = assets.find((x: any) => x.angle == angle);
				if (asset)
					return this.getCachedUrl(
						asset,
						options.size ?? 512,
						options.format ?? 'png',
					);
			}

			// Return just any?

			if (!options.noEmpty) {
				if (assets[0])
					return this.getCachedUrl(
						assets[0],
						options.size ?? 512,
						options.format ?? 'png',
					);
			}
		}

		// TODO refactor Placeholders for only if it's product
		// if (false && (product.placeholder || product.placeholderId)) {
		//     const id = product.placeholder ? product.placeholder.id : product.placeholderId;
		//     return this.dx.maps['productPlaceholder'][id].thumb;
		// }

		return this.getNoPhotoThumb(product); // TODO make generic
	}

	getNoPhotoThumb(product?: any) {
		const mixCode = product?.targetGroupId
			? this.dx.maps['targetGroup'][product.targetGroupId]?.mixCode
			: '-';

		// TODO use images assigned to targetGroups

		switch (mixCode) {
			case 'bags':
			case 'slg':
				return `https://ile-cp.s3.eu-central-1.amazonaws.com/cp/products/nophoto/elu.png`;

			case 'sra':
			default:
				return `https://ile-cp.s3.eu-central-1.amazonaws.com/cp/products/nophoto/${environment.prefix}.png`;
		}
	}
}
