/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateInputDto } from '../models/CreateInputDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class InputService {

    /**
     * @param requestBody
     * @returns boolean
     * @throws ApiError
     */
    public static inputControllerCreate(
        requestBody: CreateInputDto,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/input/android',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static inputControllerCreate2(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/input/test',
        });
    }

}
