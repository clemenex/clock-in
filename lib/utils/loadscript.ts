export const loadScript = (src: string, id: string) => {
  if (typeof document === "undefined") return Promise.resolve(true);
  if (document.getElementById(id)) return Promise.resolve(true);

  return new Promise<boolean>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.id = id;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};