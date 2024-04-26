
import { createContext, useContext, useState, } from "react";
import React from 'react';
const LoaderContext = createContext(null);

export const LoaderProvider = ({ children }) => {
    const [loader, setLoader] = useState({ loading: false, type: 'default' })
    return (
        <LoaderContext.Provider
            value={{
                loader,
                setLoader,
            }}
        >
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => {
    const context = useContext(LoaderContext)
    if (context === undefined) {
        throw new Error("LOADER_MUST_BE_USED_WITH_IN_PROVIDER");
    }
    return context;
};