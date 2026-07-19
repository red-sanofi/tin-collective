import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, staffOnly = false }) {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-block">{t("common.loading")}</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (staffOnly && !user.is_staff) {
    return <Navigate to="/" replace />;
  }

  return children;
}
