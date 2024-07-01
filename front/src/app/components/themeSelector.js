import { useState, useEffect } from 'react';
import { SiRetroarch } from 'react-icons/si';
import { IoSunny, IoMoon } from 'react-icons/io5';

const ThemeSelector = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light");

    const handleThemeChange = (selectedTheme) => {
        setTheme(selectedTheme);
    };

    useEffect(() => {
        document.body.classList.remove('darkmode', 'retro');
        if (theme === 'dark') {
            localStorage.setItem("theme", "dark");
            document.body.classList.add('darkmode');
        } else if (theme === 'retro') {
            localStorage.setItem("theme", "retro");
            document.body.classList.add('retro');
        } else {
            localStorage.setItem("theme", "light");
        }
    }, [theme]);

    return (
        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input
                type="radio"
                className="btn-check"
                name="theme"
                id="radioRetro"
                autoComplete="off"
                checked={theme === 'retro'}
                onChange={() => handleThemeChange('retro')}
            />
            <label className="btn btn-custom" htmlFor="radioRetro" title="Retro Mode">
                <SiRetroarch />
            </label>

            <input
                type="radio"
                className="btn-check"
                name="theme"
                id="radioLight"
                autoComplete="off"
                checked={theme === 'light'}
                onChange={() => handleThemeChange('light')}
            />
            <label className="btn btn-custom" htmlFor="radioLight" title="Light Mode">
                <IoSunny />
            </label>

            <input
                type="radio"
                className="btn-check"
                name="theme"
                id="radioDark"
                autoComplete="off"
                checked={theme === 'dark'}
                onChange={() => handleThemeChange('dark')}
            />
            <label className="btn btn-custom" htmlFor="radioDark" title="Dark Mode">
                <IoMoon />
            </label>
        </div>
    );
};

export default ThemeSelector;
