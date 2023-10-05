import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    constructor() {
    }

    set(key: string, value: any) {
        if (typeof value == 'object') {
            return localStorage.setItem(key, JSON.stringify(value));
        }
        return localStorage.setItem(key, value);
    }

    get(key: string) {
        const data: any = localStorage.getItem(key);

        try {
            return JSON.parse(data);
        } catch (error) {
            return data;
        }
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }

    removeAll() {
        localStorage.clear();
    }
}
