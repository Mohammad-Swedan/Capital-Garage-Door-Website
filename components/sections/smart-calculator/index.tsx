"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { m, AnimatePresence, type Variants } from "framer-motion";
import {
  Wrench,
  Home,
  Cpu,
  ShieldCheck,
  MapPin,
  Clock,
  Layers,
  Activity,
  ArrowRight,
  Phone,
  Sparkles,
  CheckCircle2,
  CalendarCheck,
  MessageCircle,
} from "lucide-react";
import { calculateEstimate, CalculatorFormData } from "./estimate-logic";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

// --- Types ---
type ChatRole = "bot" | "user";

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  isEstimate?: boolean;
}

type ChatStep =
  | "welcome"
  | "service"
  | "problems"
  | "doorType"
  | "doorSize"
  | "suburb"
  | "urgency"
  | "estimate";

// --- Components ---
function BotAvatar({ className }: { className?: string }) {
  return (
    <Image
      src="/images/chatbot-bot-icon.png"
      alt="Smart Assistant"
      width={40}
      height={40}
      className={cn("h-full w-full object-contain p-1", className)}
    />
  );
}

function TypingIndicator() {
  return (
    <m.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2 mb-4"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_0_10px_rgba(27,59,140,0.4)] ring-1 ring-primary/10">
        <BotAvatar />
      </span>
      <span className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border bg-background px-4 py-3 shadow-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
    </m.div>
  );
}

// --- Main Calculator Component ---
export function SmartPriceCalculator() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState<ChatStep>("welcome");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | undefined>(undefined);

  const [formData, setFormData] = useState<CalculatorFormData>({
    serviceType: "",
    problems: [],
    doorType: "sectional",
    doorSize: "single",
    doorMaterial: "steel",
    urgency: "week",
    suburb: "",
    photoName: null,
    photoUrl: null,
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactMethod: "sms",
  });

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, typing, step]);

  // Cleanup timers
  useEffect(() => {
    return () => clearTimeout(typingTimeoutRef.current);
  }, []);

  // Initialize chat
  useEffect(() => {
    if (messages.length === 0) {
      setTyping(true);
      typingTimeoutRef.current = window.setTimeout(() => {
        setTyping(false);
        setMessages([
          {
            id: "msg-welcome",
            role: "bot",
            text: "Hi there! 👋 I'm your Smart Pricing Assistant. I can give you an instant estimate in just a few clicks.",
          },
          {
            id: "msg-q1",
            role: "bot",
            text: "To get started, what kind of service do you need today?",
          },
        ]);
        setStep("service");
      }, 1000);
    }
  }, [messages.length]);

  const addBotMessage = (text: string, delay = 800) => {
    setTyping(true);
    typingTimeoutRef.current = window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: `msg-${Date.now()}`, role: "bot", text }]);
    }, delay);
  };

  const handleSelection = (val: string, displayLabel: string, nextAction: () => void) => {
    // Add user message
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: "user", text: displayLabel }]);
    // Hide current chips and trigger next logic
    setStep("welcome"); // Temporarily hide options
    nextAction();
  };

  const onServiceSelect = (val: string, label: string) => {
    handleSelection(val, label, () => {
      setFormData((prev) => ({ ...prev, serviceType: val }));
      addBotMessage("Got it! Can you be a bit more specific? Select the main issue below:");
      setTimeout(() => setStep("problems"), 1200);
    });
  };

  const onProblemSelect = (val: string) => {
    handleSelection(val, val, () => {
      setFormData((prev) => ({ ...prev, problems: [val] }));
      addBotMessage("Understood. What type of garage door do you have?");
      setTimeout(() => setStep("doorType"), 1200);
    });
  };

  const onDoorTypeSelect = (val: string, label: string) => {
    handleSelection(val, label, () => {
      setFormData((prev) => ({ ...prev, doorType: val }));
      addBotMessage("And what size is the door?");
      setTimeout(() => setStep("doorSize"), 1200);
    });
  };

  const onDoorSizeSelect = (val: string, label: string) => {
    handleSelection(val, label, () => {
      setFormData((prev) => ({ ...prev, doorSize: val }));
      addBotMessage("Almost done! How urgently do you need this sorted?");
      setTimeout(() => setStep("urgency"), 1200);
    });
  };

  const onUrgencySelect = (val: string, label: string) => {
    handleSelection(val, label, () => {
      setFormData((prev) => ({ ...prev, urgency: val }));
      addBotMessage("Calculating your estimate now...", 1500);
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev, 
          { id: `msg-est-${Date.now()}`, role: "bot", text: "Here is your customized estimate:", isEstimate: true }
        ]);
        setStep("estimate");
      }, 2500);
    });
  };

  // --- Rendering Helpers ---
  const renderQuickChips = () => {
    if (typing) return null;

    const container: Variants = {
      hidden: {},
      show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
    };
    const chip: Variants = {
      hidden: { opacity: 0, y: 10 },
      show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
    };

    if (step === "service") {
      const options = [
        { val: "repair", label: "Repair Service", icon: Wrench },
        { val: "installation", label: "New Door Installation", icon: Home },
        { val: "opener", label: "Motor / Opener", icon: Cpu },
        { val: "maintenance", label: "Maintenance", icon: ShieldCheck },
      ];
      return (
        <m.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-2 mt-2 px-10">
          {options.map((o) => (
            <m.button
              key={o.val}
              variants={chip}
              onClick={() => onServiceSelect(o.val, o.label)}
              className="flex items-center gap-3 w-fit rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm font-semibold text-primary shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <o.icon className="h-5 w-5 text-sky-600" />
              {o.label}
            </m.button>
          ))}
        </m.div>
      );
    }

    if (step === "problems") {
      let options: string[] = [];
      if (formData.serviceType === "repair") options = ["Door will not open", "Door stuck halfway", "Broken spring", "Broken cable", "Motor not working", "Door is noisy", "Not Sure"];
      if (formData.serviceType === "installation") options = ["Single garage door", "Double garage door", "Roller door", "Sectional door", "Need old door removed"];
      if (formData.serviceType === "opener") options = ["Replace existing motor", "New motor installation", "Smart/WiFi opener", "Extra remotes"];
      if (formData.serviceType === "maintenance") options = ["One door", "Two doors", "Safety inspection", "Annual service"];

      return (
        <m.div variants={container} initial="hidden" animate="show" className="flex flex-wrap gap-2 mt-2 px-10 max-w-lg">
          {options.map((o) => (
            <m.button
              key={o}
              variants={chip}
              onClick={() => onProblemSelect(o)}
              className="rounded-full border border-primary/20 bg-background px-4 py-2 text-sm font-medium text-primary shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              {o}
            </m.button>
          ))}
        </m.div>
      );
    }

    if (step === "doorType") {
      const options = [
        { val: "roller", label: "Roller Door" },
        { val: "sectional", label: "Sectional Door" },
        { val: "tilt", label: "Tilt Door" },
        { val: "notsure", label: "Not Sure" },
      ];
      return (
        <m.div variants={container} initial="hidden" animate="show" className="flex flex-wrap gap-2 mt-2 px-10 max-w-lg">
          {options.map((o) => (
            <m.button
              key={o.val}
              variants={chip}
              onClick={() => onDoorTypeSelect(o.val, o.label)}
              className="rounded-full border border-primary/20 bg-background px-4 py-2 text-sm font-medium text-primary shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              {o.label}
            </m.button>
          ))}
        </m.div>
      );
    }

    if (step === "doorSize") {
      const options = [
        { val: "single", label: "Single Car" },
        { val: "double", label: "Double Car" },
        { val: "custom", label: "Custom / Large" },
      ];
      return (
        <m.div variants={container} initial="hidden" animate="show" className="flex flex-wrap gap-2 mt-2 px-10 max-w-lg">
          {options.map((o) => (
            <m.button
              key={o.val}
              variants={chip}
              onClick={() => onDoorSizeSelect(o.val, o.label)}
              className="rounded-full border border-primary/20 bg-background px-4 py-2 text-sm font-medium text-primary shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              {o.label}
            </m.button>
          ))}
        </m.div>
      );
    }

    if (step === "urgency") {
      const options = [
        { val: "today", label: "Today (Emergency)" },
        { val: "24h", label: "Within 24 Hours" },
        { val: "week", label: "Sometime this week" },
        { val: "flexible", label: "Flexible" },
      ];
      return (
        <m.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-2 mt-2 px-10 max-w-sm">
          {options.map((o) => (
            <m.button
              key={o.val}
              variants={chip}
              onClick={() => onUrgencySelect(o.val, o.label)}
              className="flex items-center justify-between rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm font-medium text-primary shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              {o.label}
              <ArrowRight className="h-4 w-4 text-sky-500" />
            </m.button>
          ))}
        </m.div>
      );
    }

    if (step === "estimate" && !typing) {
      const estimate = calculateEstimate(formData);

      return (
        <m.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="ml-10 mt-4 max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-primary to-[#0f4e9b] p-6 text-white text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
             <Sparkles className="absolute top-4 left-4 h-6 w-6 text-amber-300 opacity-50" />
             <h3 className="text-sm font-bold uppercase tracking-wider text-white/80 mb-2">Estimated Range</h3>
             <div className="text-4xl font-black tracking-tight">
                ${estimate.minPrice} <span className="text-3xl text-white/50 font-medium mx-1">-</span> ${estimate.maxPrice}
              </div>
          </div>
          
          <div className="p-6">
            <p className="text-sm font-medium text-slate-800 text-center mb-6 bg-slate-50 py-2 rounded-xl border border-slate-100">
              {estimate.likelyIssue}
            </p>
            
            <div className="space-y-3 mb-6">
              {estimate.breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm items-center">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-semibold text-slate-900 border-b border-dotted border-slate-300">${item.min} - ${item.max}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="h-4 w-4" /> No hidden call-out fees
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="h-4 w-4" /> Trusted Local Technicians
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => alert('Booking opened!')} className="flex-1 rounded-xl bg-sky-600 py-3 text-sm font-bold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-700 transition-all flex items-center justify-center gap-2">
                <CalendarCheck className="h-4 w-4" /> Book Now
              </button>
              <a href={`tel:${siteConfig.business.phone}`} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>
        </m.div>
      );
    }

    return null;
  };

  return (
    <div className="mx-auto w-full max-w-3xl min-h-[70vh] flex flex-col bg-slate-50 rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden relative">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-sky-100/50 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-200/60 bg-white/80 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-100 p-1">
            <BotAvatar />
            <span className="absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
              Smart Assistant <Sparkles className="h-4 w-4 text-amber-400" />
            </h2>
            <p className="text-xs font-medium text-emerald-600 flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Online - Ready to estimate
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="relative z-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 space-y-6 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent"
      >
        {messages.map((msg) => {
          const isBot = msg.role === "bot";
          if (msg.isEstimate) return null; // handled separately

          return (
            <m.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex items-end gap-3", isBot ? "justify-start" : "justify-end")}
            >
              {isBot && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-100 p-0.5">
                  <BotAvatar />
                </span>
              )}
              <span
                className={cn(
                  "max-w-[80%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm",
                  isBot
                    ? "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                    : "rounded-br-md bg-gradient-to-br from-sky-600 to-blue-700 text-white shadow-sky-600/20"
                )}
              >
                {msg.text}
              </span>
            </m.div>
          );
        })}

        <AnimatePresence>{typing && <TypingIndicator />}</AnimatePresence>

        {renderQuickChips()}
        
      </div>
      
      {/* Decorative Composer Bar (Non-functional, purely aesthetic) */}
      <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-center">
         <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
           <MessageCircle className="h-3 w-3" /> Select an option above to reply
         </p>
      </div>

    </div>
  );
}

export default SmartPriceCalculator;
