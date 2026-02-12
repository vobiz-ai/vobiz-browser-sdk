/* eslint-disable*/
'use strict';
import { Client, ConfiguationOptions } from './client';
import { Logger } from './logger';

class Vobiz {
  client: Client;
  constructor(options: ConfiguationOptions) {
    // Check for existing instance of Vobiz object
    if (typeof window['_VobizInstance' as any] === 'object') {
      Logger.info('window.Vobiz object and its instance already exist');
      this.client = (window as any)._VobizInstance
    } else {
      this.client = new Client(options);
    }
  }

}
Object.defineProperty(Vobiz, 'client', { enumerable: true });

export default Vobiz;

module.exports = Vobiz;
