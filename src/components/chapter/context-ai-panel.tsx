import type { PrototypeAssistantCard } from "@/lib/prototype/agent-prototype-data";

type ContextAiPanelProps = {
  title: string;
  cards: PrototypeAssistantCard[];
};

export function ContextAiPanel({ title, cards }: ContextAiPanelProps) {
  return (
    <aside className="grid gap-4">
      <section className="rounded-[28px] border border-foreground/10 bg-white/72 p-5 shadow-[0_18px_50px_rgba(29,20,13,0.08)]">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </section>

      {cards.map((card) => (
        <section
          key={card.title}
          className="rounded-[28px] border border-foreground/10 bg-white/80 p-5 shadow-[0_18px_50px_rgba(29,20,13,0.08)]"
        >
          <h3 className="text-lg font-semibold">{card.title}</h3>
          {card.body ? <p className="mt-3 text-sm leading-7 text-foreground/72">{card.body}</p> : null}
          {card.actions ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {card.actions.map((action, index) => (
                <button
                  key={action}
                  className={`rounded-full px-4 py-3 text-sm font-semibold ${
                    index === 0
                      ? "bg-foreground text-background"
                      : "border border-foreground/15 bg-white text-foreground"
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
          ) : null}
        </section>
      ))}
    </aside>
  );
}
