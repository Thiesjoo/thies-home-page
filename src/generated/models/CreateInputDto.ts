/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { battery } from './battery';
import type { bluetooth } from './bluetooth';
import type { network } from './network';
import type { system } from './system';

export type CreateInputDto = {
    bluetooth: bluetooth;
    network: network;
    system: system;
    battery: battery;
};

