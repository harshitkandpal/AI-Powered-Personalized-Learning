import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../components/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <FaSun className="text-yellow-500 w-5 h-5" />
      ) : (
        <FaMoon className="text-gray-500 w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;