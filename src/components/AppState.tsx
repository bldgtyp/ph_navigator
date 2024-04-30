import { AppStateTypes } from '../types/AppState';

export class AppState {
    state: AppStateTypes;
    eventHandlers: { [event: string]: Function } = {};
    dismountHandlers: { [event: string]: Function } = {};

    constructor(state: AppStateTypes) {
        this.state = state;
    }

    addEventHandler(event: string, handler: Function) {
        // Will get added when the State is switched 'on'
        this.eventHandlers[event] = handler;
    }
    addDismountHandler(event: string, handler: Function) {
        // Will run when the State is switched 'off'
        this.dismountHandlers[event] = handler;
    }
};

export const states: { [key: number]: AppState } = {
    0: new AppState(AppStateTypes.None),
    1: new AppState(AppStateTypes.SurfaceQuery),
    2: new AppState(AppStateTypes.Measurement),
    3: new AppState(AppStateTypes.Comments),
    4: new AppState(AppStateTypes.Spaces),
    5: new AppState(AppStateTypes.SunPath),
    6: new AppState(AppStateTypes.WindowRadiation),
    7: new AppState(AppStateTypes.Ventilation),
    8: new AppState(AppStateTypes.HotWaterPiping),
    9: new AppState(AppStateTypes.ThermalBridging),
};

export function addEventHandler(appState: number, eventName: string, callbackFunction: any) {
    states[appState].addEventHandler(eventName, callbackFunction);
}

export function addDismountHandler(appState: number, eventName: string, callbackFunction: any) {
    states[appState].addDismountHandler(eventName, callbackFunction);
}