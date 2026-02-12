/* eslint-disable import/no-cycle */
// eslint-disable-next-line import/named
import { Client } from "../client";
import { Logger } from "../logger";
import * as C from "../constants";
import { NoiseSuppressionEffect } from "./NoiseSuppressionEffect";
import { replaceStream } from "../media/audioDevice";
import getBrowserDetails from "../utils/browserDetection";

const Vobiz = {
  log: Logger,
};

// eslint-disable-next-line import/prefer-default-export
export class NoiseSuppression {
  private client: Client;

  private noiseSuppresionEffect: NoiseSuppressionEffect;

  public noiseSupressionRunning: boolean = false;

  public started = false;

  constructor(client: Client) {
    this.client = client;
    if (client.enableNoiseReduction && !this.noiseSuppresionEffect && getBrowserDetails().browser !== 'safari') {
      Vobiz.log.info(`${C.LOGCAT.CALL_QUALITY} | Noise Suppression instance created`);
      this.initNoiseSuppresionEffect();
    }
  }

  private initNoiseSuppresionEffect = function (): Promise<void> {
    return new Promise((resolve) => {
      this.noiseSuppresionEffect = new NoiseSuppressionEffect();
      this.noiseSuppresionEffect.prepareAudioWorklet(
        this.client.noiseReductionFilePath,
      ).then(() => {
        this.client.emit('onNoiseReductionReady');
        resolve();
      });
    });
  };

  public startNoiseSuppression = function (mediaStream?: MediaStream):
  Promise<MediaStream | null> {
    return new Promise((resolve) => {
      if (this.noiseSupressionRunning) {
        Vobiz.log.info(`${C.LOGCAT.CALL_QUALITY} | Noise Suppression is already running. Cannot start again`);
        resolve((window as any).localStream);
      } else if (mediaStream) {
        if (this.noiseSuppresionEffect
          && this.noiseSuppresionEffect.noiseSuppressorNode && this.started) {
          Vobiz.log.debug(`${C.LOGCAT.CALL_QUALITY} | Noise Suppression started. Starting effect on current stream`);
          this.noiseSupressionRunning = true;
          this.noiseSuppresionEffect.startEffect(mediaStream).then((processedStream) => {
            (window as any).localStream = processedStream;
            resolve(processedStream);
          });
        } else {
          Vobiz.log.debug(`${C.LOGCAT.CALL_QUALITY} | Noise Suppression is not running, returning mediastream`);
          (window as any).localStream = mediaStream;
          resolve(mediaStream);
        }
      } else {
        this.setLocalMediaStream().then((stream: any) => {
          Vobiz.log.info(`${C.LOGCAT.CALL_QUALITY} | Fetching new stream to process`);
          if (stream) {
            if (this.noiseSuppresionEffect
              && this.noiseSuppresionEffect.noiseSuppressorNode && this.started) {
              Vobiz.log.info(`${C.LOGCAT.CALL_QUALITY} | Noise Suppression started. Starting effect on new stream`);
              this.noiseSupressionRunning = true;
              this.noiseSuppresionEffect.startEffect(stream).then((processedStream) => {
                (window as any).localStream = processedStream;
                resolve(processedStream);
              });
            } else {
              Vobiz.log.info(`${C.LOGCAT.CALL_QUALITY} | Noise Suppression is not running, returning new stream without processing`);
              resolve(stream);
            }
          } else {
            Vobiz.log.error(`${C.LOGCAT.CALL_QUALITY} | Could not fetch new stream. Returning current localStream`);
            resolve((window as any).localStream);
          }
        }).catch((err) => {
          Vobiz.log.error(`${C.LOGCAT.CALL_QUALITY} | Error while fetching the new stream ${err}`);
          resolve((window as any).localStream);
        });
      }
    });
  };

  public stopNoiseSuppresion = (): void => {
    if (this.noiseSuppresionEffect && this.noiseSuppresionEffect.noiseSuppressorNode) {
      if (!this.noiseSupressionRunning) {
        Vobiz.log.debug(`${C.LOGCAT.CALL_QUALITY} | Noise Suppression is already stopped. Cannot stop again`);
        return;
      }
      Vobiz.log.debug(`${C.LOGCAT.CALL_QUALITY} | Stopping noise suppression`);
      this.noiseSupressionRunning = false;
      this.noiseSuppresionEffect.stopEffect();
    }
  };

  public setLocalMediaStream = function (): Promise<MediaStream | null> {
    return new Promise((resolve, reject) => {
      if ((window as any).localStream) {
        Vobiz.log.debug(`${C.LOGCAT.CALL_QUALITY} | Returning current localstream`);
        resolve((window as any).localStream);
      } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: this.client.options.audioConstraints, video: false })
          .then((mediaStream) => {
            Vobiz.log.debug(`${C.LOGCAT.CALL_QUALITY} | Got the new stream from getUserMedia`);
            (window as any).localStream = mediaStream;
            resolve(mediaStream);
          }).catch((err) => {
            Vobiz.log.debug(`${C.LOGCAT.CALL_QUALITY} | Error in navigator.getUserMedia ${err}`);
            reject(err);
          });
      } else {
        Vobiz.log.error(`${C.LOGCAT.CALL_QUALITY} | Usermedia:Not available, Noise suppression will not work`);
        reject(new Error('getUserMedia not available'));
      }
    });
  };

  public updateProcessingStream = function (stream: MediaStream): Promise<MediaStream | null> {
    return new Promise((resolve) => {
      if (this.noiseSuppresionEffect && (this.noiseSupressionRunning || this.started)) {
        this.stopNoiseSuppresion();
        this.startNoiseSuppression(stream).then((newStream) => {
          Vobiz.log.debug(`${C.LOGCAT.CALL_QUALITY} | Updated stream with a new stream`);
          (window as any).localStream = newStream;
          resolve(newStream);
        });
      } else {
        Vobiz.log.debug(`${C.LOGCAT.CALL_QUALITY} | Noise suppresion not started. Returning current stream`);
        resolve(stream);
      }
    });
  };

  public clearNoiseSupression = (): void => {
    if (this.noiseSuppresionEffect) {
      Vobiz.log.debug(`${C.LOGCAT.CALL_QUALITY} | Noise suppression cleared`);
      this.noiseSupressionRunning = false;
      this.started = false;
      this.noiseSuppresionEffect.clearEffect();
    }
  };

  public muteStream = (): void => {
    if (this.noiseSuppresionEffect && this.noiseSupressionRunning) {
      Vobiz.log.debug(`${C.LOGCAT.CALL_QUALITY} | processed stream muted`);
      this.noiseSuppresionEffect.muteEffect();
    }
  };

  public unmuteStream = (): void => {
    if (this.noiseSuppresionEffect && this.noiseSupressionRunning) {
      Vobiz.log.debug(`${C.LOGCAT.CALL_QUALITY} | processed stream unmuted`);
      this.noiseSuppresionEffect.unmuteEffect();
    }
  };

  // eslint-disable-next-line func-names
  public startNoiseSuppresionManual = function (): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.noiseSuppresionEffect
        && this.noiseSuppresionEffect.noiseSuppressorNode
        && this.client) {
        Vobiz.log.debug(`${C.LOGCAT.CALL_QUALITY} | starting noise suppresion`);
        if (this.started) {
          Vobiz.log.info(`${C.LOGCAT.CALL_QUALITY} | noise suppresion already started. Cannot start again`);
          reject(new Error('Noise suprresion is already started'));
        } else {
          this.started = true;
          replaceStream(this.client, { audio: this.client.options.audioConstraints, video: false })
            .then(() => {
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        }
      } else {
        reject(new Error('Noise reduction is not instantiated. Please check if "enableNoiseReduction" is passed as true while initializing the SDK'));
      }
    });
  };

  // eslint-disable-next-line func-names
  public stopNoiseSuppressionManual = function (): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.noiseSuppresionEffect
        && this.noiseSuppresionEffect.noiseSuppressorNode
        && this.client) {
        Vobiz.log.debug(`${C.LOGCAT.CALL_QUALITY} | stopping noise suppresion`);
        if (!this.started) {
          Vobiz.log.debug(`${C.LOGCAT.CALL_QUALITY} | noise suppresion already stopped. Cannot stop again`);
          reject(new Error('Noise suprresion is already stopped'));
        } else {
          this.started = false;
          replaceStream(this.client, { audio: this.client.options.audioConstraints, video: false })
            .then(() => {
              resolve();
            }).catch((err) => {
              reject(err);
            });
        }
      } else {
        reject(new Error('Noise reduction is not instantiated. Please check if "enableNoiseReduction" is passed as true while initializing the SDK'));
      }
    });
  };
}
