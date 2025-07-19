import { Moon, Sun } from 'lucide-react';

interface DarkModeToggleProps {
  darkMode: boolean;
  toggleDark: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, toggleDark }) => (
  <button
    onClick={toggleDark}
    className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition"
    aria-label="Toggle dark mode"
  >
    {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800" />}
  </button>
);

export default DarkModeToggle;