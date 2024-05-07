import { AppState, states } from '../components/AppState';
import { createContext, useContext, useReducer } from 'react';

// -- useReducer instead of useState so that THREE.js works
const setAppStateReducer = (_appState: AppState, _appStateNumber: number) => {
    return states[_appStateNumber]
}

// --
const defaultAppState = { appState: states[0], dispatch: () => 0 }
type AppStateContextType = { appState: AppState, dispatch: React.Dispatch<number> }
export const AppStateContext = createContext<AppStateContextType>(defaultAppState)

// --
export function AppStateContextProvider({ children }: any) {
    const [_appState, _appStateDispatch] = useReducer(setAppStateReducer, states[0])

    return (
        <AppStateContext.Provider value={{ appState: _appState, dispatch: _appStateDispatch }}>
            {children}
        </AppStateContext.Provider>
    );
}

// -- Child components should consume the context through this hook
export function useAppStateContext() {
    const context = useContext(AppStateContext);
    return context;
}