import { useTheme } from "../context/ThemeContext";
import ArtisanLayout from "./layouts/ArtisanLayout";
import GalleryLayout from "./layouts/GalleryLayout";
import PosterLayout from "./layouts/PosterLayout";

const layouts = {
  poster: PosterLayout,
  artisan: ArtisanLayout,
  gallery: GalleryLayout,
};

export default function Layout() {
  const { theme } = useTheme();
  const LayoutComponent = layouts[theme] || PosterLayout;
  return <LayoutComponent />;
}
