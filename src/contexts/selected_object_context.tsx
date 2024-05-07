import { createContext, useContext, useReducer } from 'react';

// --
type SelectedObjectContextType = { selectedObject: any, dispatch: React.Dispatch<any> }
export const SelectedObjectContext = createContext<SelectedObjectContextType | null>(null)

// --
export function SelectedObjectContextProvider({ children }: any) {
    const [_selectedObject, _selectedObjectDispatch] = useReducer(() => null, null)

    return (
        <SelectedObjectContext.Provider value={{ selectedObject: _selectedObject, dispatch: _selectedObjectDispatch }}>
            {children}
        </SelectedObjectContext.Provider>
    );
}

// -- Child components should consume the context through this hook
export function useSelectedObjectContext() {
    const context = useContext(SelectedObjectContext);
    return context;
}