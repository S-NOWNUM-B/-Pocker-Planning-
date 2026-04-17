import { Description, Field, Label, Radio, RadioGroup as HeadlessRadioGroup } from '@headlessui/react';

type Primitive = string | number;

export interface RadioOption<T extends Primitive = string> {
  value: T;
  title: string;
  description?: string;
}

export interface RadioGroupProps<T extends Primitive = string> {
  value: T;
  onChange: (value: T) => void;
  options: RadioOption<T>[];
  label?: string;
  className?: string;
  columnsClassName?: string;
}

export function RadioGroup<T extends Primitive = string>({
  value,
  onChange,
  options,
  label,
  className = '',
  columnsClassName = 'grid gap-3 sm:grid-cols-2',
}: RadioGroupProps<T>) {
  return (
    <div className={className}>
      {label && <div className="mb-2 text-sm font-medium text-foreground">{label}</div>}
      <HeadlessRadioGroup value={value} onChange={onChange} className={columnsClassName}>
        {options.map((option) => (
          <Field key={String(option.value)} className="contents">
            <Radio
              value={option.value}
              className="group cursor-pointer rounded-xl border border-border bg-secondary/40 p-4 text-left outline-none transition-all duration-200 data-checked:border-primary data-checked:bg-primary/10 data-checked:shadow-sm data-focus:ring-2 data-focus:ring-primary/40 hover:border-primary/50"
            >
              <Label className="block font-semibold text-foreground">{option.title}</Label>
              {option.description && (
                <Description className="mt-1 text-sm text-muted-foreground">
                  {option.description}
                </Description>
              )}
            </Radio>
          </Field>
        ))}
      </HeadlessRadioGroup>
    </div>
  );
}
