"use client";

import { useEffect } from "react";

type ConsultationWindow = Window & {
  evergreenConsultationController?: { refresh: () => void };
};

export default function ConsultationController() {
  useEffect(() => {
    const controllerWindow = window as ConsultationWindow;
    const refresh = () => controllerWindow.evergreenConsultationController?.refresh();
    if (controllerWindow.evergreenConsultationController) {
      refresh();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>("script[data-consultation-controller]");
    const shouldAppend = !script;
    if (!script) {
      script = document.createElement("script");
      script.src = "/consultation-form.js?v=20261118-submit";
      script.async = true;
      script.dataset.consultationController = "true";
    }
    const failed = () => {
      for (const status of document.querySelectorAll<HTMLElement>("[data-consultation-form] [data-form-status]")) {
        status.textContent = "The request form could not load. Refresh the page to try again.";
      }
    };
    script.addEventListener("load", refresh);
    script.addEventListener("error", failed);
    if (shouldAppend) document.head.append(script);

    return () => {
      script.removeEventListener("load", refresh);
      script.removeEventListener("error", failed);
    };
  }, []);

  return null;
}
