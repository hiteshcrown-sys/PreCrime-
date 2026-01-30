import React, { createContext, useState, useContext, useEffect } from 'react';

const CityContext = createContext();

export const CityProvider = ({ children }) => {
    const [selectedCity, setSelectedCity] = useState("Delhi");

    // Load from localStorage if available
    useEffect(() => {
        const savedCity = localStorage.getItem('precrime_selected_city');
        if (savedCity) {
            setSelectedCity(savedCity);
        }
    }, []);

    const handleSetCity = (city) => {
        setSelectedCity(city);
        localStorage.setItem('precrime_selected_city', city);
    };

    return (
        <CityContext.Provider value={{ selectedCity, setSelectedCity: handleSetCity }}>
            {children}
        </CityContext.Provider>
    );
};

export const useCity = () => {
    const context = useContext(CityContext);
    if (!context) {
        throw new Error('useCity must be used within a CityProvider');
    }
    return context;
};

export default CityContext;
