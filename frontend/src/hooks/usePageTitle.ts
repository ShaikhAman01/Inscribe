import { useEffect } from "react";

const SITE = "Inscribe";

export const usePageTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : `${SITE}: write, share and discover stories`;
  }, [title]);
};
