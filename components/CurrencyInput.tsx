import React from 'react';
import { formatBRL, parseBRL } from '@/utils/format';

type Props = {
  value: number;
  onValueChange: (v: number) => void;
  className?: string;
  placeholder?: string;
};

export default function CurrencyInput({ value, onValueChange, className, placeholder }: Props) {
  const [text, setText] = React.useState<string>(() => formatBRL(value || 0));

  React.useEffect(() => {
    // keep in sync when external value changes
    setText(formatBRL(value || 0));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const num = parseBRL(raw);
    setText(formatBRL(num));
    onValueChange(num);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={text}
      onChange={handleChange}
      onFocus={handleFocus}
      placeholder={placeholder || "0,00"}
      className={["w-full rounded-xl border border-slate-300 px-3 py-2 text-right text-slate-900 placeholder-slate-400",
        "focus:outline-none focus:ring-2 focus:ring-sky-600/40 focus:border-sky-600", className || ""].join(" ")}
    />
  );
}
