const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
  "caramellatte",
  "abyss",
  "silk",
];

const ThemeSelector = ({ theme, onThemeChange }) => {
  return (
    <label className="flex min-w-0 items-center gap-2">
      <span className="hidden text-sm font-medium sm:inline">Theme</span>
      <select
        value={theme}
        onChange={(event) => onThemeChange(event.target.value)}
        className="select select-bordered select-sm w-full sm:w-36"
        aria-label="Choose color theme"
      >
        {themes.map((themeName) => (
          <option key={themeName} value={themeName}>
            {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
          </option>
        ))}
      </select>
    </label>
  );
};

export default ThemeSelector;
