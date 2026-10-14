export default function Card({ children, hover = false, className = "" }: { children: React.ReactNode; hover?: boolean; className?: string }) {
  return (
    <div className={`group rounded-2xl border border-bronze/25 bg-white/60 p-6 backdrop-blur-md ${hover ? "transition duration-300 hover:-translate-y-1 hover:border-bronze hover:bg-white/85" : ""} ${className}`}>
      {children}
    </div>
  );
}
