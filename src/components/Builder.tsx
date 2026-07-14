import { useBuilder } from '../state/BuilderContext';
import { StepSection } from './StepSection';
import s from './Builder.module.css';

export function Builder() {
  const { catalog } = useBuilder();
  return (
    <div className={s.builder}>
      {catalog.steps.map((step, index) => (
        <StepSection key={step.id} step={step} index={index} />
      ))}
    </div>
  );
}
