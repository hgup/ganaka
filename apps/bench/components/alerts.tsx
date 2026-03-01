import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert, AlertDescription, AlertTitle } from "@ui/alert";

export function AlertDestructive({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Alert variant="destructive" className="max-w-md">
        <div className="flex gap-4 items-center">
      <HugeiconsIcon icon={AlertCircleIcon} size={16}/>
      <AlertTitle>{title}</AlertTitle>
</div>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
