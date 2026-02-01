import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        appearance: {
            primaryColor: '#4F46E5', // Default Indigo
            theme: 'light',
            logoUrl: ''
        }
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const response = await settingsAPI.getSettings();
            if (response.data?.data) {
                setSettings(response.data.data);
                applyTheme(response.data.data.appearance);
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings) => {
        try {
            // Optimistic update
            setSettings(newSettings);
            applyTheme(newSettings.appearance);
            await settingsAPI.updateSettings(newSettings);
        } catch (error) {
            console.error('Failed to update settings:', error);
            fetchSettings(); // Revert on error
        }
    };

    const applyTheme = (appearance) => {
        if (!appearance) return;

        // 1. Apply Theme Mode (Dark/Light)
        const root = window.document.documentElement;
        if (appearance.theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // 2. Apply Primary Color
        // We update the CSS variables that Tailwind uses (if configured)
        if (appearance.primaryColor) {
            const hex = appearance.primaryColor;

            // Update the main variables used by Tailwind config (we will update tailwind.config.js to use these)
            // We generate a simple palette or just set the main ones. 
            // For simplicity, we set the most used shades to the chosen color, 
            // and maybe lighter/darker varations if we want to be fancy.

            // Simple spread for now:
            root.style.setProperty('--primary-500', hex);
            root.style.setProperty('--primary-600', hex); // Main Actions
            root.style.setProperty('--primary-700', adjustBrightness(hex, -10)); // Hover

            // Also update the legacy valid CSS variable if used elsewhere
            root.style.setProperty('--education-primary', hex);
        }
    };

    // Helper to darken/lighten hex slightly
    const adjustBrightness = (col, amt) => {
        var usePound = false;
        if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
        }
        var num = parseInt(col, 16);
        var r = (num >> 16) + amt;
        if (r > 255) r = 255;
        else if (r < 0) r = 0;
        var b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) b = 255;
        else if (b < 0) b = 0;
        var g = (num & 0x0000FF) + amt;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;
        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchSettings();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, refreshSettings: fetchSettings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};
