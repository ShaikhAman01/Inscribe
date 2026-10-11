import { RefObject, useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Keeps Tab inside an open dialog and returns focus to the opener when it closes.
export const useDialogFocus = (panelRef: RefObject<HTMLElement>, isOpen: boolean) => {
  const opener = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);

  // Read during render: autoFocus inside the dialog moves focus before effects run.
  if (isOpen && !wasOpen.current) opener.current = document.activeElement as HTMLElement | null;
  wasOpen.current = isOpen;

  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (panel && !panel.contains(document.activeElement)) {
      panel.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panelRef.current.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTab);

    return () => {
      document.removeEventListener("keydown", handleTab);
      const target = opener.current;
      if (target?.isConnected) target.focus();
    };
  }, [isOpen, panelRef]);
};
