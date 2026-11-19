import { useEffect, useRef } from "react";
import * as Sentry from "@sentry/tanstackstart-react";
import { Megaphone } from "@phosphor-icons/react";
import { Button } from "@/shadcn/ui/button";

// DEV_NOTE: Sentry's own trigger sizes its icon in em off the dialog's font size, so a 10px icon would shrink the whole
// dialog. The integration runs with autoInject off (router.tsx); this button only opens its dialog, so the icon is
// sized here and the dialog keeps its normal text.
export default function FeedbackButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const feedback = Sentry.getFeedback();
    if (!button || !feedback) return;
    return feedback.attachTo(button);
  }, []);

  return (
    <Button
      ref={buttonRef}
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label="Report a bug"
      title="Report a bug"
      className="fixed right-4 bottom-4 z-50 shadow-lg"
    >
      <Megaphone size={10} aria-hidden />
    </Button>
  );
}
