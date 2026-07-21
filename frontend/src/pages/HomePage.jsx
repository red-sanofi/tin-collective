import { useTheme } from "../context/ThemeContext";
import HomePageArtisan from "./home/HomePageArtisan";
import HomePageGallery from "./home/HomePageGallery";
import HomePagePoster from "./home/HomePagePoster";

const homePages = {
  poster: HomePagePoster,
  artisan: HomePageArtisan,
  gallery: HomePageGallery,
};

export default function HomePage() {
  const { theme } = useTheme();
  const HomeComponent = homePages[theme] || HomePagePoster;
  return <HomeComponent />;
}
