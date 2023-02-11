/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateDevice } from '../models/CreateDevice';
import type { Device } from '../models/Device';
import type { UpdateDevice } from '../models/UpdateDevice';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DevicesService {

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static devicesControllerCreate(
        requestBody: CreateDevice,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/devices',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns Device
     * @throws ApiError
     */
    public static devicesControllerFindAll(): CancelablePromise<Array<Device>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/devices',
        });
    }

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
     * @returns Device
     * @throws ApiError
     */
    public static devicesControllerFindOne(
        id: string,
    ): CancelablePromise<Device> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/devices/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static devicesControllerUpdate(
        id: string,
        requestBody: UpdateDevice,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/devices/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static devicesControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/devices/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static devicesControllerAuthorizeNewToken(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/devices/{id}/mtm',
            path: {
                'id': id,
            },
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
