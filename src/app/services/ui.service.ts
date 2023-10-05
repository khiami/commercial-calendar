import {Injectable, Renderer2, RendererFactory2, TemplateRef} from '@angular/core';
import { LocalStorageService } from './local-storage.service';


@Injectable({
    providedIn: 'root'
})
export class UiService {

    menus: any = {};
    userSettings: any = {};
    userSettingsMap: any = {};
    settings: any = {};
    settingsMap: any = {};

    constructor(
        private localStorageService: LocalStorageService
    ) {}

    getSetting(code: string, isLocal: boolean = false): any {
        if (isLocal) {
            return this.localStorageService.get(code);
        } else {
            return this.settingsMap[code];
        }
    }

    getSettingBool(code: string, isLocal: boolean = false) {
        let value = this.getSetting(code, isLocal);

        if (typeof value == 'string') {
            value = value?.toLowerCase();
            return value == '1' || value == 'true' || value == 'yes' || value == 'on' || value == 'enabled' || value == 't';
        }

        return !!value;
    }

}