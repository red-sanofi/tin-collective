import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api/client";

export default function OAuthButtons() {
  const { t } = useTranslation();
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    api
      .getOAuthProviders()
      .then(setProviders)
      .catch(() => setProviders([]));
  }, []);

  if (providers.length === 0) {
    return null;
  }

  return (
    <div className="oauth-buttons">
      <p className="oauth-divider">{t("auth.orContinueWith")}</p>
      <div className="oauth-button-row">
        {providers.map((provider) => (
          <a
            key={provider.id}
            href={provider.login_url}
            className={`oauth-btn oauth-${provider.id}`}
          >
            {t(`auth.oauth.${provider.id}`, { defaultValue: provider.name })}
          </a>
        ))}
      </div>
    </div>
  );
}
