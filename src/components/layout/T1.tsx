export default function T1() {
  return (
    <div dir="ltr" className="mt-5 flex items-center justify-center">
      <a
        href="https://t1w.ir"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2"
      >
        <span className="pointer-events-none absolute inset-y-0 -right-1/3 w-1/3 rotate-12 bg-gradient-to-l from-white/0 via-white/20 to-white/0 opacity-0 blur-md transition-all duration-700 group-hover:-translate-x-[420%] group-hover:opacity-100" />

        <span className="absolute bottom-0 right-0 h-px w-full origin-right scale-x-0 bg-gradient-to-l from-orange-400 via-orange-200/70 to-transparent transition-transform duration-500 group-hover:scale-x-100" />

        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inset-0 rounded-full bg-orange-400/70 blur-[6px] animate-pulse" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-orange-400 transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_14px_rgba(251,146,60,0.85)]" />
        </span>

        <span className="text-xs text-[#8d8d8d] transition-colors duration-300 group-hover:text-[#c7c7c7] md:text-sm">
          Powered &amp; Developed by
        </span>

        <span className="relative">
          <span className="absolute inset-0 scale-110 rounded-full bg-orange-400/20 blur-xl opacity-40 animate-pulse" />
          <span className="relative bg-gradient-to-r from-white via-orange-100 to-orange-300 bg-clip-text text-sm font-black tracking-[0.22em] text-transparent transition-all duration-300 md:text-base group-hover:from-white group-hover:via-orange-50 group-hover:to-orange-400">
            TIVAN
          </span>
          <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-orange-400 to-transparent transition-all duration-500 group-hover:w-full" />
        </span>

        <span className="translate-y-[1px] text-[10px] tracking-[0.26em] text-[#666] opacity-70 transition-all duration-500 group-hover:translate-y-0 group-hover:text-orange-300 group-hover:opacity-100">
          T1W.IR
        </span>
      </a>
    </div>
  );
}
