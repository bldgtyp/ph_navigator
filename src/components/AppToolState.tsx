// The App can be in many 'states'. Each State will mount an arbitrary number of 
// event handlers when activated. The AppToolState class
// will also unmount these event-handlers and visibility settings when the State is
// deactivated.

export enum appToolStateTypeEnum {
    None = 0,
    SurfaceQuery = 1,
    Measurement = 2,
    Comments = 3,
}

type EventHandlerFunction = (event: any) => void;
type MountHandlerFunction = () => void;
type DismountHandlerFunction = () => void;

export class AppToolState {
    toolState: appToolStateTypeEnum;
    eventHandlers: { [event: string]: EventHandlerFunction } = {};
    mountHandlers: { [event: string]: MountHandlerFunction } = {};
    dismountHandlers: { [event: string]: DismountHandlerFunction } = {};

    constructor(toolState: appToolStateTypeEnum) {
        this.toolState = toolState;
    }

    addEventHandler(event: string, handler: EventHandlerFunction) {
        // All these will get added when the ToolState is switched 'on'
        // They will all get removed when the ToolState is switched 'off'
        this.eventHandlers[event] = handler;
    }
    addMountHandler(event: string, handler: MountHandlerFunction) {
        // All these will run when the ToolState is switched 'on'
        this.mountHandlers[event] = handler;
    }
    addDismountHandler(event: string, handler: DismountHandlerFunction) {
        // All these will run when the ToolState is switched 'off'
        this.dismountHandlers[event] = handler;
    }
}

export const toolStates: { [key: number]: AppToolState } = {
    0: new AppToolState(appToolStateTypeEnum.None),
    1: new AppToolState(appToolStateTypeEnum.SurfaceQuery),
    2: new AppToolState(appToolStateTypeEnum.Measurement),
    3: new AppToolState(appToolStateTypeEnum.Comments),
};

export function addEventHandler(appToolState: number, eventName: string, callbackFunction: EventHandlerFunction) {
    toolStates[appToolState].addEventHandler(eventName, callbackFunction);
}

export function addMountHandler(appToolState: number, eventName: string, callbackFunction: MountHandlerFunction) {
    toolStates[appToolState].addMountHandler(eventName, callbackFunction);
}

export function addDismountHandler(appToolState: number, eventName: string, callbackFunction: DismountHandlerFunction) {
    toolStates[appToolState].addDismountHandler(eventName, callbackFunction);
}
