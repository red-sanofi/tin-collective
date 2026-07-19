import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function AuthCallbackPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { completeOAuthLogin } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const params = new URLSearchParams(hash);
    const access = params.get("access");
    const refresh = params.get("refresh");
    const oauthError = params.get("error");

    if (oauthError) {
      setError(t("auth.oauthFailed"));
      return;
    }

    if (!access || !refresh) {
      setError(t("auth.oauthFailed"));
      return;
    }

    completeOAuthLogin(access, refresh)
      .then(() => navigate("/profile", { replace: true }))
      .catch(() => setError(t("auth.oauthFailed")));
  }, [completeOAuthLogin, navigate, t]);

  return (
    <div className="auth-page panel auth-panel-chaos">
      {error ? (
        <>
          <div className="alert alert-error">{error}</div>
          <button type="button" className="btn btn-primary" onClick={() => navigate("/login")}>
            {t("auth.loginButton")}
          </button>
        </>
      ) : (
        <div className="loading-block">{t("auth.oauthCompleting")}</div>
      )}
    </div>
  );
}
