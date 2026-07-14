import { useBuilder } from "@/state/builder-context";
import StepSection from "@/components/step-section";

export default function Builder() {
  const { catalog } = useBuilder();
  return (
    <div className="flex flex-col gap-1.25 sm:gap-3.25">
      {catalog.steps.map((step, index) => (
        <StepSection key={step.id} step={step} index={index} />
      ))}
    </div>
  );
}
