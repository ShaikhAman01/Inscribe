export const plainText = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

export const excerpt = (html: string, length = 300) => {
  const text = plainText(html);
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
};

export const readMinutes = (html: string) =>
  Math.max(1, Math.ceil(plainText(html).split(" ").filter(Boolean).length / 200));
