import usefulData from "./usefulData";
import "./usefulInformation.css";
import { Trans, useTranslation } from "react-i18next";
import { JSX } from "react";

interface LinkData {
  url: string;
  label: string;
}

const UsefulInformation = () => {
  const { t } = useTranslation();

  const renderTextWithLinks = (key: string, links: LinkData[] | null) => {
    if (!links || links.length === 0) return t(key);

    const components: Record<string, JSX.Element> = {};
    links.forEach((link, index) => {
      components[`link${index + 1}`] = (
        <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
          {link.label}
        </a>
      );
    });

    return <Trans i18nKey={key} components={components} />;
  };

  return (
    <div className="usefulinfo-container">
      <h2>{t("usfInfo")}</h2>
      <ul>
        {usefulData.map((item, index) => (
          <li key={index}>
            {renderTextWithLinks(item.translationKey, item.links)}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsefulInformation;
