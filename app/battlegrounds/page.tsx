import Hero from "@/components/Hero";

export default function BattlegroundsPage() {
  return (
    <main className="pt-0">
      <div
        className="max-w-7xl mx-0.5 px-2 pt-2 pb-4"
        style={{ maxWidth: "1280px" }}
      >
        <Hero game="battlegrounds" />
      </div>
    </main>
  );
}
