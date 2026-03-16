import type {
  PrototypeAssistantCard,
  PrototypeConfirmationCard,
  PrototypeRepairCard,
} from "@/lib/prototype/agent-prototype-data";

type ContextAiPanelProps = {
  title: string;
  cards: PrototypeAssistantCard[];
  confirmationCard?: PrototypeConfirmationCard | null;
  repairCard?: PrototypeRepairCard | null;
};

export function ContextAiPanel({ title, cards, confirmationCard, repairCard }: ContextAiPanelProps) {
  return (
    <aside className="grid gap-4">
      <section className="rounded-[28px] border border-foreground/10 bg-white/72 p-5 shadow-[0_18px_50px_rgba(29,20,13,0.08)]">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </section>

      {confirmationCard ? (
        <section className="rounded-[28px] border border-amber-300 bg-amber-50 p-5 shadow-[0_18px_50px_rgba(29,20,13,0.08)]">
          <h3 className="text-lg font-semibold text-amber-950">{confirmationCard.title}</h3>
          <p className="mt-3 text-sm leading-7 text-amber-950/80">{confirmationCard.body}</p>
          <div className="mt-4 rounded-2xl border border-amber-200 bg-white/80 p-4 text-sm leading-7 text-amber-950/80">
            {confirmationCard.impact}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background">
              {confirmationCard.confirmLabel}
            </button>
            <button className="rounded-full border border-foreground/15 bg-white px-4 py-3 text-sm font-semibold text-foreground">
              {confirmationCard.rejectLabel}
            </button>
          </div>
        </section>
      ) : null}

      {repairCard ? (
        <section className="rounded-[28px] border border-rose-300 bg-rose-50 p-5 shadow-[0_18px_50px_rgba(29,20,13,0.08)]">
          <h3 className="text-lg font-semibold text-rose-950">{repairCard.title}</h3>
          <p className="mt-3 text-sm leading-7 text-rose-950/80">{repairCard.body}</p>
          <div className="mt-4 rounded-2xl border border-rose-200 bg-white/80 p-4 text-sm leading-7 text-rose-950/80">
            {repairCard.evidence}
          </div>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-rose-950/80">
            {repairCard.recommendations.map((recommendation) => (
              <li key={recommendation}>{recommendation}</li>
            ))}
          </ul>
        </section>
      ) : null}

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
