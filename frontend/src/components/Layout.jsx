import { useTheme } from "../context/ThemeContext";
import ArtisanLayout from "./layouts/ArtisanLayout";
import PosterLayout from "./layouts/PosterLayout";

export default function Layout() {
  const { theme } = useTheme();
  return theme === "artisan" ? <ArtisanLayout /> : <PosterLayout />;
}
