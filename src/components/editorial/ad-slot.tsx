type AdSlotProps = {
  label: string;
};

export function AdSlot({ label }: AdSlotProps) {
  return (
    <aside className="grid min-h-28 place-items-center rounded border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
        Publicidad · {label}
      </p>
    </aside>
  );
}
