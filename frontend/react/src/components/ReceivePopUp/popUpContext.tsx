import React, { createContext, useState, useContext } from 'react'

export type PopupContextType = {
    value: string | null
    clearPopup: () => void
    triggerPopup: (value: JSX.Element) => void
}

const PopupContext = createContext({})

export const PopupProvider = ({ children }: any) => {
    const [value, setValue] = useState("")
    const triggerPopup = (text:string) => {
        setValue(text);
    }
    const clearPopup = () => setValue("")

    return (
        <PopupContext.Provider value={{ value, triggerPopup, clearPopup }}>
            {children}
        </PopupContext.Provider>
    )
}

export const usePopup = () => {
    const obj = useContext(PopupContext);
    return obj;
};
