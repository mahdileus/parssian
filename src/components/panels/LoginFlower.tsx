"use client";
import dynamic from "next/dynamic";
import { Component, useRef, type ReactNode } from "react";
const LotusScene = dynamic(() => import("@/components/lotus/LotusScene"), { ssr: false, loading: () => <div className="flex h-full items-center justify-center text-sm text-[#d7b99c]">گل پارسیان در حال شکفتن است…</div> });
class FlowerBoundary extends Component<{children:ReactNode},{failed:boolean}> {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed ? <div className="flex h-full items-center justify-center"><svg width="200" height="240" viewBox="0 0 200 240" aria-label="گل پارسیان" role="img" fill="none"><path d="M100 190v40" stroke="#d7b99c" strokeWidth="2"/>{[-65,-35,0,35,65].map(angle=><ellipse key={angle} cx="100" cy="115" rx="28" ry="75" transform={`rotate(${angle} 100 180)`} fill="#d7b99c25" stroke="#d7b99c"/>)}</svg></div> : this.props.children;}
}
export default function LoginFlower() {
 const progress=useRef({v:0.65});
 return <div className="login-flower" role="img" aria-label="گل سه‌بعدی پارسیان"><div className="login-orbit"/><FlowerBoundary><LotusScene progress={progress}/></FlowerBoundary></div>;
}
