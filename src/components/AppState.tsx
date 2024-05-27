// The App can be in many 'states'. Each State will mount an arbitrary number of 
// event handlers, and visibility settings when activated. The AppState class
// will also unmount these event-handlers and visibility settings when the State is
// deactivated.

export enum appStateTypeEnum {
    None = 0,
    SurfaceQuery = 1,
    Measurement = 2,
    Comments = 3,
    Spaces = 4,
    SunPath = 5,
    Ventilation = 6,
    HotWaterPiping = 7,
    SpaceFloors = 8,
}

type EventHandlerFunction = (event: any) => void;
type MountHandlerFunction = () => void;
type DismountHandlerFunction = () => void;

export class AppState {
    state: appStateTypeEnum;
    eventHandlers: { [event: string]: EventHandlerFunction } = {};
    mountHandlers: { [event: string]: MountHandlerFunction } = {};
    dismountHandlers: { [event: string]: DismountHandlerFunction } = {};

    constructor(state: appStateTypeEnum) {
        this.state = state;
    }


    addEventHandler(event: string, handler: EventHandlerFunction) {
        // All these will get added when the State is switched 'on'
        // They will all get removed when the State is switched 'off'
        this.eventHandlers[event] = handler;
    }
    addMountHandler(event: string, handler: MountHandlerFunction) {
        // All these will run when the State is switched 'on'
        this.mountHandlers[event] = handler;
    }
    addDismountHandler(event: string, handler: DismountHandlerFunction) {
        // All these will run when the State is switched 'off'
        this.dismountHandlers[event] = handler;
    }
}

export const states: { [key: number]: AppState } = {
    0: new AppState(appStateTypeEnum.None),
    1: new AppState(appStateTypeEnum.SurfaceQuery),
    2: new AppState(appStateTypeEnum.Measurement),
    3: new AppState(appStateTypeEnum.Comments),
    4: new AppState(appStateTypeEnum.Spaces),
    5: new AppState(appStateTypeEnum.SunPath),
    6: new AppState(appStateTypeEnum.Ventilation),
    7: new AppState(appStateTypeEnum.HotWaterPiping),
    8: new AppState(appStateTypeEnum.SpaceFloors),
};

export function addEventHandler(appState: number, eventName: string, callbackFunction: EventHandlerFunction) {
    states[appState].addEventHandler(eventName, callbackFunction);
}

export function addMountHandler(appState: number, eventName: string, callbackFunction: MountHandlerFunction) {
    states[appState].addMountHandler(eventName, callbackFunction);
}

export function addDismountHandler(appState: number, eventName: string, callbackFunction: DismountHandlerFunction) {
    states[appState].addDismountHandler(eventName, callbackFunction);
}
