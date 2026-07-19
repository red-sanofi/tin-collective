import { useTheme } from "../context/ThemeContext";
import HomePageArtisan from "./home/HomePageArtisan";
import HomePagePoster from "./home/HomePagePoster";

export default function HomePage() {
  const { theme } = useTheme();
  return theme === "artisan" ? <HomePageArtisan /> : <HomePagePoster />;
}
