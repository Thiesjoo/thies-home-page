/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LiveDataService {

    /**
     * Get all live data for all devices
     * @returns any
     * @throws ApiError
     */
    public static devicesControllerGetAllLiveData(): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/devices/livedata',
        });
    }

    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static devicesControllerGetLiveData(
        id: string,
    ): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/devices/{id}/livedata',
            path: {
                'id': id,
            },
        });
    }

}
