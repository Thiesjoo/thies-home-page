/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NotificationActions } from './NotificationActions';

export type CreateNotification = {
    type: any;
    title: string;
    actions: Array<NotificationActions>;
    images: string;
    icon: string;
    icon2: string;
    pkg: string;
    appname: string;
    text: string;
    text2: string;
    dismiss_action: string;
    click_action: string;
    priority: number;
    deviceID: string;
    localid: string;
    userid: string;
};

