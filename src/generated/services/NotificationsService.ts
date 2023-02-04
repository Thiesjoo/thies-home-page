/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActionOnNotificationDTO } from '../models/ActionOnNotificationDTO';
import type { CreateNotification } from '../models/CreateNotification';
import type { NotificationFileUpload } from '../models/NotificationFileUpload';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class NotificationsService {

    /**
     * This route also handles the update and delete of a notification.
     * If type is set to 'Cancelled' the notification will be deleted.
     * If type is set to 'Updated' the notification will be deleted and a new one will be created.
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerCreate(
        requestBody: CreateNotification,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/notifications',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get all notifications from the current logged in user
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerFindAll(): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notifications',
        });
    }

    /**
     * @param formData
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerUploadFile(
        formData: NotificationFileUpload,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/notifications/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerGetImage(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notifications/image/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Get all notifications from a specific device
     * @param deviceid
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerFindForDevice(
        deviceid: string,
    ): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notifications/devices/{deviceid}/notifications',
            path: {
                'deviceid': deviceid,
            },
        });
    }

    /**
     * Delete all notifications from a specific device
     * @param deviceid
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerDeleteAllForDevice(
        deviceid: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/notifications/devices/{deviceid}/notifications',
            path: {
                'deviceid': deviceid,
            },
        });
    }

    /**
     * Execute an action on a notification
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static notificationsControllerSubmitAction(
        id: string,
        requestBody: ActionOnNotificationDTO,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/notifications/{id}',
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
    public static notificationsControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/notifications/{id}',
            path: {
                'id': id,
            },
        });
    }

}
