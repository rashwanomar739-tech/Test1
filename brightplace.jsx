import { useState, useEffect } from "react";
import {
  BookOpen, Wifi, MapPin, Gift, Plus, Check, ChevronRight,
  Target, Sparkles, Play, LayoutDashboard, Calendar, Eye, EyeOff,
  AlertCircle, Timer, Coins, Trash2, Lightbulb, Brain,
  HelpCircle, BarChart2, Bell, CheckCircle2
} from "lucide-react";

// ─────────────────────────────────────────────────────────
// DESIGN TOKENS — 4 colours only, research-backed for ADHD
//   Background : #F5F0E8  warm parchment (reduces visual noise)
//   Surface    : #EDE7D9  slightly deeper parchment
//   Ink        : #3D3530  dark warm brown (text)
//   Sage       : #7A9E87  muted sage green (primary accent)
//   Terracotta : #B5714A  dusty terracotta (secondary — used sparingly)
// ─────────────────────────────────────────────────────────
const T = {
  bg:       "#F5F0E8",
  surface:  "#EDE7D9",
  surface2: "#E3DBCA",
  ink:      "#3D3530",
  inkLight: "#7A6E66",
  inkFaint: "#B0A89E",
  sage:     "#7A9E87",
  sageDim:  "#A8C4B0",
  sageBg:   "rgba(122,158,135,0.12)",
  terra:    "#B5714A",
  terraDim: "#C9936E",
  terraBg:  "rgba(181,113,74,0.10)",
  line:     "rgba(61,53,48,0.09)",
  lineMed:  "rgba(61,53,48,0.15)",
};

// ── CONFETTI (earth tones only) ───────────────────────────
function Confetti({ active, onDone }) {
  const particles = Array.from({ length: 36 }, (_, i) => i);
  const colors = [T.sage, T.sageDim, T.terra, T.terraDim, "#D4C5A9", "#C4B99A"];
  useEffect(() => {
    if (active) { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }
  }, [active, onDone]);
  if (!active) return null;
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>
      {particles.map(i => (
        <div key={i} style={{
          position:"absolute",
          left:`${Math.random()*100}%`, top:"-10px",
          width:`${6+Math.random()*8}px`, height:`${6+Math.random()*8}px`,
          backgroundColor: colors[Math.floor(Math.random()*colors.length)],
          borderRadius: Math.random()>0.5?"50%":"2px",
          animation:`confettiFall ${1.4+Math.random()*1}s ease-in forwards`,
          animationDelay:`${Math.random()*0.5}s`,
        }}/>
      ))}
    </div>
  );
}

// ── XP BAR ───────────────────────────────────────────────
function XPBar({ xp, maxXp, level }) {
  const pct = Math.min((xp / maxXp) * 100, 100);
  return (
    <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
      <span style={{fontSize:"11px",fontWeight:800,color:T.terra,whiteSpace:"nowrap"}}>Lv.{level}</span>
      <div style={{flex:1,height:"7px",background:T.surface2,borderRadius:"999px",overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:"999px",background:T.sage,
          width:`${pct}%`,transition:"width 0.7s ease"}}/>
      </div>
      <span style={{fontSize:"10px",color:T.inkFaint,whiteSpace:"nowrap"}}>{xp}/{maxXp}</span>
    </div>
  );
}

// ── COUNTDOWN HOOK ───────────────────────────────────────
function useCountdown(targetTime) {
  const [diff, setDiff] = useState(null);
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const [h, m] = targetTime.split(":").map(Number);
      const target = new Date(); target.setHours(h, m, 0, 0);
      if (target < now) target.setDate(target.getDate() + 1);
      setDiff(Math.max(0, Math.floor((target - now) / 1000)));
    };
    calc(); const id = setInterval(calc, 1000); return () => clearInterval(id);
  }, [targetTime]);
  if (diff === null) return "--:--";
  const hh = Math.floor(diff/3600), mm = Math.floor((diff%3600)/60), ss = diff%60;
  if (hh > 0) return `${hh}h ${mm}m`;
  if (mm > 0) return `${mm}m ${ss}s`;
  return `${ss}s`;
}

// ── CLASS CARD ───────────────────────────────────────────
function ClassCard({ cls }) {
  const isOnline = cls.type === "online";
  const reminderOffset = isOnline ? 5 : 30;
  const countdown = useCountdown(cls.time);
  const now = new Date();
  const [h, m] = cls.time.split(":").map(Number);
  const target = new Date(); target.setHours(h, m, 0, 0);
  const minsLeft = Math.max(0, Math.floor((target - now) / 60000));
  const urgent = minsLeft <= reminderOffset;

  return (
    <div style={{borderRadius:"14px",padding:"16px",
      background:T.surface, border:`1px solid ${urgent ? T.terra : T.line}`,
      transition:"border-color 0.3s",
      outline: urgent ? `3px solid ${T.terraBg}` : "none",
    }}>
      <div style={{display:"flex",alignItems:"start",justifyContent:"space-between",gap:"12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <div style={{padding:"8px",borderRadius:"10px",background:T.sageBg,flexShrink:0}}>
            {isOnline ? <Wifi size={15} color={T.sage}/> : <MapPin size={15} color={T.sage}/>}
          </div>
          <div>
            <div style={{fontWeight:700,color:T.ink,fontSize:"13px",lineHeight:1.3}}>{cls.name}</div>
            <div style={{fontSize:"11px",color:T.inkLight,marginTop:"3px"}}>
              {isOnline ? "Online class" : cls.location}
            </div>
          </div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontSize:"18px",fontWeight:800,lineHeight:1,
            color:urgent ? T.terra : T.sage,
            fontFamily:"'Space Mono',monospace"}}>{countdown}</div>
          <div style={{fontSize:"10px",color:T.inkFaint,marginTop:"2px"}}>
            {isOnline ? "log on in" : "leave in"}
          </div>
        </div>
      </div>

      {urgent && (
        <div style={{marginTop:"10px",padding:"8px 12px",borderRadius:"10px",
          background:T.terraBg, border:`1px solid rgba(181,113,74,0.2)`,
          display:"flex",alignItems:"center",gap:"8px",
          fontSize:"12px",fontWeight:700,color:T.terra}}>
          <AlertCircle size={12}/>
          {isOnline ? `Open Zoom in ~${reminderOffset} min` : `Leave now — ~${reminderOffset} min travel`}
          {isOnline && (
            <button style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"4px",
              padding:"4px 10px",borderRadius:"7px",border:"none",
              background:T.terra,color:"#fff",cursor:"pointer",
              fontWeight:800,fontSize:"11px",fontFamily:"'Nunito',sans-serif"}}>
              <Play size={9}/>Launch
            </button>
          )}
        </div>
      )}

      <div style={{marginTop:"10px",fontSize:"10px",color:T.inkFaint,
        display:"flex",alignItems:"center",gap:"5px"}}>
        <Calendar size={10}/>{cls.day} · {cls.time}
      </div>
    </div>
  );
}

// ── QUEST CARD ───────────────────────────────────────────
function QuestCard({ quest, onComplete, onDelete }) {
  const diffLabel = { easy:"Low effort", medium:"Some effort", hard:"Deep work" };
  const diffColor = { easy:T.sage, medium:T.terra, hard:T.ink };

  return (
    <div style={{borderRadius:"12px",padding:"14px 16px",
      background:quest.done ? T.surface2 : T.surface,
      border:`1px solid ${T.line}`,
      opacity:quest.done ? 0.65 : 1,
      display:"flex",alignItems:"start",gap:"12px",
      transition:"opacity 0.2s, background 0.2s"}}>

      <button onClick={() => !quest.done && onComplete(quest.id)}
        style={{marginTop:"2px",width:"20px",height:"20px",borderRadius:"50%",
          border:`2px solid ${quest.done ? T.sage : T.inkFaint}`,
          background:quest.done ? T.sage : "transparent",
          display:"flex",alignItems:"center",justifyContent:"center",
          cursor:quest.done?"default":"pointer",flexShrink:0,transition:"all 0.2s"}}>
        {quest.done && <Check size={10} color="#fff"/>}
      </button>

      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:700,fontSize:"13px",lineHeight:1.35,
          color:quest.done ? T.inkFaint : T.ink,
          textDecoration:quest.done ? "line-through" : "none"}}>
          {quest.title}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"10px",marginTop:"5px",flexWrap:"wrap"}}>
          <span style={{fontSize:"10px",fontWeight:700,color:diffColor[quest.difficulty]}}>
            {diffLabel[quest.difficulty]}
          </span>
          <span style={{fontSize:"10px",color:T.inkFaint,display:"flex",alignItems:"center",gap:"3px"}}>
            <Coins size={9}/>{quest.xp} XP
          </span>
          {quest.deadline && (
            <span style={{fontSize:"10px",color:T.inkFaint,display:"flex",alignItems:"center",gap:"3px"}}>
              <Timer size={9}/>{quest.deadline}
            </span>
          )}
        </div>
      </div>

      <button onClick={() => onDelete(quest.id)}
        style={{background:"transparent",border:"none",color:T.inkFaint,
          cursor:"pointer",padding:"2px",lineHeight:0,flexShrink:0,transition:"color 0.15s"}}
        onMouseEnter={e=>e.currentTarget.style.color=T.terra}
        onMouseLeave={e=>e.currentTarget.style.color=T.inkFaint}>
        <Trash2 size={13}/>
      </button>
    </div>
  );
}

// ── REWARD CARD ──────────────────────────────────────────
function RewardCard({ reward, coins, onBuy }) {
  const canAfford = coins >= reward.cost;
  return (
    <div style={{borderRadius:"14px",padding:"16px",
      background:canAfford ? T.surface : T.surface2,
      border:`1px solid ${canAfford ? T.lineMed : T.line}`,
      opacity:canAfford ? 1 : 0.55, transition:"all 0.2s"}}>
      <div style={{fontSize:"24px",marginBottom:"8px"}}>{reward.emoji}</div>
      <div style={{fontWeight:700,color:T.ink,fontSize:"13px",marginBottom:"10px",lineHeight:1.3}}>
        {reward.name}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{color:T.terra,fontWeight:800,fontSize:"12px",display:"flex",alignItems:"center",gap:"4px"}}>
          <Coins size={10}/>{reward.cost}
        </span>
        <button onClick={() => canAfford && onBuy(reward)} disabled={!canAfford}
          style={{padding:"5px 12px",borderRadius:"8px",border:"none",
            cursor:canAfford?"pointer":"not-allowed",
            background:canAfford ? T.sage : T.surface2,
            color:canAfford ? "#fff" : T.inkFaint,
            fontWeight:800,fontSize:"11px",fontFamily:"'Nunito',sans-serif",transition:"all 0.15s"}}>
          {canAfford ? "Redeem" : "Locked"}
        </button>
      </div>
    </div>
  );
}

// ── RESOURCE CARD ────────────────────────────────────────
function ResourceCard({ item }) {
  return (
    <div style={{borderRadius:"14px",padding:"16px",
      background:T.surface, border:`1px solid ${T.line}`,
      cursor:"pointer",transition:"border-color 0.2s"}}
      onMouseEnter={e=>e.currentTarget.style.borderColor=T.sageDim}
      onMouseLeave={e=>e.currentTarget.style.borderColor=T.line}>
      <div style={{fontSize:"20px",marginBottom:"8px"}}>{item.emoji}</div>
      <div style={{fontWeight:700,color:T.ink,fontSize:"13px",marginBottom:"4px"}}>{item.title}</div>
      <div style={{fontSize:"11px",color:T.inkLight,lineHeight:1.5,marginBottom:"10px",
        display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
        {item.desc}
      </div>
      <span style={{fontSize:"10px",fontWeight:700,padding:"3px 9px",borderRadius:"999px",
        background:T.sageBg, color:T.sage, border:`1px solid rgba(122,158,135,0.2)`}}>
        {item.category}
      </span>
    </div>
  );
}

// ── SECTION LABEL ────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{fontSize:"10px",fontWeight:800,color:T.inkFaint,
      textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"10px"}}>
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// BRIGHTPLACE APP
// ══════════════════════════════════════════════════════════
export default function App() {
  const [activeTab, setActiveTab]       = useState("dashboard");
  const [focusMode, setFocusMode]       = useState(false);
  const [confetti, setConfetti]         = useState(false);
  const [xp, setXp]                     = useState(340);
  const [coins, setCoins]               = useState(120);
  const [level, setLevel]               = useState(4);
  const [streak]                        = useState(5);
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [newQuest, setNewQuest]         = useState({ title:"", difficulty:"easy", deadline:"" });
  const [toast, setToast]               = useState(null);

  const [quests, setQuests] = useState([
    { id:1, title:"Complete PSYC 101 reading (Ch. 7)", difficulty:"medium", xp:50, deadline:"Today 11pm", done:false },
    { id:2, title:"Submit lab report draft",           difficulty:"hard",   xp:80, deadline:"Tomorrow",  done:false },
    { id:3, title:"Watch lecture recording (Week 8)",  difficulty:"easy",   xp:25, deadline:"This week", done:false },
    { id:4, title:"Email Prof. about office hours",    difficulty:"easy",   xp:20, deadline:"",          done:true  },
  ]);

  const classes = [
    { id:1, name:"PSYC 101 – Intro to Psychology", type:"in-person", location:"Arts Building, Rm 204", time:"10:30", day:"Mon / Wed / Fri" },
    { id:2, name:"CS 200 – Data Structures",       type:"online",    location:"",                     time:"13:00", day:"Tue / Thu"       },
    { id:3, name:"MATH 150 – Calculus II",         type:"in-person", location:"Science Hall, Rm 118", time:"15:30", day:"Mon / Wed"       },
    { id:4, name:"ENGL 102 – Critical Writing",    type:"online",    location:"",                     time:"09:00", day:"Friday"          },
  ];

  const rewards = [
    { id:1, name:"1 hour gaming",       emoji:"🎮", cost:100 },
    { id:2, name:"Netflix episode",     emoji:"📺", cost:60  },
    { id:3, name:"Favourite snack",     emoji:"🍕", cost:40  },
    { id:4, name:"30 min social media", emoji:"📱", cost:30  },
    { id:5, name:"Guilt-free nap",      emoji:"😴", cost:50  },
    { id:6, name:"Café treat",          emoji:"☕", cost:80  },
  ];

  const resources = [
    { id:1, title:"Pomodoro for ADHD Brains",    emoji:"🍅", category:"Study Tips",   desc:"A modified 15/5 method that works with hyperfocus, not against it." },
    { id:2, title:"Lo-Fi Study Playlist",         emoji:"🎵", category:"Focus Music",  desc:"Two hours, no lyrics — keeps dopamine steady without distraction." },
    { id:3, title:"Campus Quick Routes",          emoji:"🗺️", category:"Campus Guide", desc:"Fastest walking paths between buildings so you're never late again." },
    { id:4, title:"Body Doubling Sessions",       emoji:"👥", category:"Study Tips",   desc:"Virtual co-working rooms open 24/7 for quiet accountability." },
    { id:5, title:"Binaural Beats for Focus",     emoji:"🧠", category:"Focus Music",  desc:"40 Hz gamma waves — research-backed for attention support." },
    { id:6, title:"Accessibility Services Guide", emoji:"🏛️", category:"Campus Guide", desc:"How to register and get academic accommodations on campus." },
  ];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const completeQuest = (id) => {
    const q = quests.find(q => q.id === id);
    if (!q || q.done) return;
    setQuests(prev => prev.map(x => x.id === id ? {...x, done:true} : x));
    setXp(prev => prev + q.xp);
    setCoins(prev => prev + Math.floor(q.xp / 2));
    setConfetti(true);
    showToast(`Quest done! +${q.xp} XP · +${Math.floor(q.xp/2)} coins`);
  };

  const deleteQuest  = (id) => setQuests(prev => prev.filter(q => q.id !== id));

  const addQuest = () => {
    if (!newQuest.title.trim()) return;
    const xpMap = { easy:20, medium:50, hard:80 };
    setQuests(prev => [...prev, {
      id:Date.now(), title:newQuest.title, difficulty:newQuest.difficulty,
      xp:xpMap[newQuest.difficulty], deadline:newQuest.deadline, done:false
    }]);
    setNewQuest({ title:"", difficulty:"easy", deadline:"" });
    setShowAddQuest(false);
    showToast("Quest added to your board");
  };

  const buyReward = (reward) => {
    setCoins(prev => prev - reward.cost);
    showToast(`"${reward.name}" unlocked — you earned it ${reward.emoji}`);
  };

  const activeQuests = quests.filter(q => !q.done);
  const doneQuests   = quests.filter(q =>  q.done);
  const maxXp        = level * 100 + 100;

  const navItems = [
    { id:"dashboard", icon:LayoutDashboard, label:"My Home"  },
    { id:"quests",    icon:Target,          label:"Quests"   },
    { id:"schedule",  icon:Calendar,        label:"Schedule" },
    { id:"rewards",   icon:Gift,            label:"Rewards"  },
    { id:"resources", icon:BookOpen,        label:"Content"  },
  ];

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const inputStyle = {
    padding:"10px 14px", borderRadius:"10px",
    border:`1px solid ${T.lineMed}`, background:T.bg,
    color:T.ink, fontFamily:"'Nunito',sans-serif",
    fontSize:"13px", outline:"none", width:"100%",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=Nunito:wght@400;600;700;800&family=Space+Mono:wght@700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { height:100%; font-family:'Nunito',sans-serif;
          background:${T.bg}; color:${T.ink}; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:${T.surface}; }
        ::-webkit-scrollbar-thumb { background:${T.surface2}; border-radius:3px; }
        @keyframes confettiFall {
          0%   { transform:translateY(0) rotate(0deg); opacity:1; }
          100% { transform:translateY(110vh) rotate(540deg); opacity:0; }
        }
        @keyframes fadeUp {
          from { transform:translateY(8px); opacity:0; }
          to   { transform:translateY(0); opacity:1; }
        }
        @keyframes toastIn {
          from { transform:translateX(-50%) translateY(-8px); opacity:0; }
          to   { transform:translateX(-50%) translateY(0); opacity:1; }
        }
        .page { animation:fadeUp 0.22s ease; }
        .nav-btn:hover { background:${T.sageBg} !important; color:${T.sage} !important; }
        .sb-btn:hover  { background:${T.sageBg} !important; color:${T.sage} !important; }
        .pri-btn:hover { background:${T.sageDim} !important; }
        .del-btn:hover { color:${T.terra} !important; }
        input::placeholder { color:${T.inkFaint}; }
        input { color-scheme:light; }
      `}</style>

      <Confetti active={confetti} onDone={() => setConfetti(false)}/>

      {/* Toast */}
      {toast && (
        <div style={{position:"fixed",top:"64px",left:"50%",zIndex:9000,
          background:T.ink, color:T.bg,
          padding:"10px 18px", borderRadius:"10px",
          fontWeight:700, fontSize:"13px",
          display:"flex", alignItems:"center", gap:"8px",
          boxShadow:`0 4px 20px rgba(61,53,48,0.18)`,
          whiteSpace:"nowrap", animation:"toastIn 0.2s ease",
          transform:"translateX(-50%)"}}>
          <CheckCircle2 size={14} color={T.sage}/>{toast}
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden"}}>

        {/* ── TOP HEADER ─────────────────────────────────── */}
        <header style={{height:"56px",flexShrink:0,background:T.surface,
          borderBottom:`1px solid ${T.lineMed}`,
          display:"flex",alignItems:"center",padding:"0 18px",
          position:"sticky",top:0,zIndex:100}}>

          {/* Wordmark */}
          <div style={{display:"flex",alignItems:"center",gap:"9px",marginRight:"24px",flexShrink:0}}>
            <div style={{width:"30px",height:"30px",flexShrink:0,
              background:T.terra,
              clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Lightbulb size={13} color="#fff"/>
            </div>
            <div>
              <div style={{fontSize:"17px",fontWeight:600,fontFamily:"'Lora',serif",
                lineHeight:1,color:T.ink,letterSpacing:"-0.2px"}}>
                <span style={{color:T.terra}}>Bright</span>Place
              </div>
              <div style={{fontSize:"8px",fontWeight:700,color:T.inkFaint,
                letterSpacing:"0.13em",textTransform:"uppercase",marginTop:"1px"}}>
                not your average LMS
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{display:"flex",alignItems:"stretch",height:"100%",flex:1,gap:"1px"}}>
            {navItems.map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className="nav-btn"
                  style={{display:"flex",alignItems:"center",gap:"6px",
                    padding:"0 13px",background:"transparent",border:"none",
                    borderBottom:`2px solid ${active ? T.terra : "transparent"}`,
                    color:active ? T.terra : T.inkLight,
                    cursor:"pointer",fontFamily:"'Nunito',sans-serif",
                    fontWeight:700,fontSize:"13px",transition:"all 0.15s",
                    whiteSpace:"nowrap",position:"relative"}}>
                  <Icon size={14}/>{item.label}
                  {item.id==="quests" && activeQuests.length > 0 && (
                    <span style={{position:"absolute",top:"8px",right:"4px",
                      background:T.terra,color:"#fff",borderRadius:"999px",
                      padding:"1px 5px",fontSize:"9px",fontWeight:900}}>
                      {activeQuests.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right controls */}
          <div style={{display:"flex",alignItems:"center",gap:"10px",marginLeft:"auto",flexShrink:0}}>
            <button onClick={() => setFocusMode(f => !f)}
              style={{display:"flex",alignItems:"center",gap:"5px",
                padding:"5px 11px",borderRadius:"8px",
                border:`1px solid ${T.lineMed}`,background:"transparent",
                color:focusMode ? T.terra : T.inkLight,cursor:"pointer",
                fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"12px",
                transition:"all 0.15s"}}>
              {focusMode ? <EyeOff size={12}/> : <Eye size={12}/>}
              {focusMode ? "Exit Focus" : "Focus"}
            </button>

            <div style={{display:"flex",alignItems:"center",gap:"5px",
              padding:"4px 10px",borderRadius:"20px",
              background:T.terraBg,border:`1px solid rgba(181,113,74,0.2)`}}>
              <Coins size={12} color={T.terra}/>
              <span style={{fontSize:"12px",fontWeight:800,color:T.terra}}>{coins}</span>
            </div>

            <div style={{display:"flex",alignItems:"center",gap:"7px",
              padding:"4px 10px 4px 4px",borderRadius:"999px",
              background:T.surface2,border:`1px solid ${T.lineMed}`}}>
              <div style={{width:"26px",height:"26px",borderRadius:"50%",
                background:T.sage,display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:"12px"}}>🧙</div>
              <div style={{lineHeight:1}}>
                <div style={{fontSize:"11px",fontWeight:800,color:T.ink}}>Lv.{level}</div>
                <div style={{fontSize:"9px",color:T.inkFaint}}>{streak} day streak 🔥</div>
              </div>
            </div>
          </div>
        </header>

        {/* ── BREADCRUMB ──────────────────────────────────── */}
        {!focusMode && (
          <div style={{height:"33px",flexShrink:0,background:T.bg,
            borderBottom:`1px solid ${T.line}`,
            display:"flex",alignItems:"center",
            justifyContent:"space-between",padding:"0 22px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"6px",
              fontSize:"12px",color:T.inkFaint}}>
              <span style={{color:T.terra,fontWeight:700}}>BrightPlace</span>
              <span>›</span>
              <span style={{color:T.inkLight,fontWeight:600}}>
                {navItems.find(n=>n.id===activeTab)?.label}
              </span>
            </div>
            <div style={{width:"176px"}}>
              <XPBar xp={xp} maxXp={maxXp} level={level}/>
            </div>
          </div>
        )}

        {/* ── FOCUS BANNER ────────────────────────────────── */}
        {focusMode && (
          <div style={{padding:"7px 22px",flexShrink:0,
            background:T.terraBg,
            borderBottom:`1px solid rgba(181,113,74,0.15)`,
            display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:"12px",fontWeight:700,color:T.terra,
              display:"flex",alignItems:"center",gap:"6px"}}>
              <Eye size={13}/>Focus mode — extras hidden
            </span>
            <span style={{fontSize:"11px",color:T.terraDim}}>
              BrightPlace is rooting for you 🧡
            </span>
          </div>
        )}

        {/* ── BODY ────────────────────────────────────────── */}
        <div style={{flex:1,display:"flex",overflow:"hidden"}}>

          {/* Sidebar */}
          {!focusMode && (
            <aside style={{width:"186px",flexShrink:0,
              background:T.surface,borderRight:`1px solid ${T.line}`,
              display:"flex",flexDirection:"column",
              padding:"14px 8px",overflowY:"auto"}}>

              <SectionLabel>Course Tools</SectionLabel>

              {[
                { icon:LayoutDashboard, label:"My Home",    tab:"dashboard" },
                { icon:Target,          label:"Quest Board",tab:"quests"    },
                { icon:Calendar,        label:"Schedule",   tab:"schedule"  },
                { icon:Gift,            label:"Rewards",    tab:"rewards"   },
                { icon:BookOpen,        label:"Content",    tab:"resources" },
                { icon:BarChart2,       label:"Progress",   tab:"dashboard" },
                { icon:Bell,            label:"Alerts",     tab:"dashboard" },
                { icon:HelpCircle,      label:"Support",    tab:"resources" },
              ].map((item,i) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab &&
                  ["My Home","Quest Board","Schedule","Rewards","Content"].includes(item.label);
                return (
                  <button key={i} onClick={() => setActiveTab(item.tab)}
                    className="sb-btn"
                    style={{display:"flex",alignItems:"center",gap:"8px",
                      padding:"9px 10px",borderRadius:"8px",border:"none",
                      background:isActive ? T.sageBg : "transparent",
                      color:isActive ? T.sage : T.inkLight,
                      cursor:"pointer",fontFamily:"'Nunito',sans-serif",
                      fontWeight:700,fontSize:"13px",textAlign:"left",
                      width:"100%",transition:"all 0.15s",
                      borderLeft:`2px solid ${isActive ? T.sage : "transparent"}`}}>
                    <Icon size={13}/>{item.label}
                  </button>
                );
              })}

              <div style={{marginTop:"auto",paddingTop:"14px",borderTop:`1px solid ${T.line}`}}>
                <SectionLabel>My Courses</SectionLabel>
                {["PSYC 101","CS 200","MATH 150","ENGL 102"].map((c,i) => (
                  <div key={i} style={{padding:"6px 10px",fontSize:"12px",color:T.inkLight,
                    fontWeight:600,cursor:"pointer",borderRadius:"6px",transition:"color 0.15s"}}
                    onMouseEnter={e=>e.currentTarget.style.color=T.terra}
                    onMouseLeave={e=>e.currentTarget.style.color=T.inkLight}>
                    {c}
                  </div>
                ))}
              </div>
            </aside>
          )}

          {/* Page */}
          <main style={{flex:1,padding:"24px 28px",overflowY:"auto",background:T.bg}}>

            {/* ── DASHBOARD ─────────────────────────────── */}
            {activeTab === "dashboard" && (
              <div className="page" style={{display:"flex",flexDirection:"column",
                gap:"20px",maxWidth:"840px"}}>

                {/* Welcome card */}
                <div style={{borderRadius:"16px",padding:"22px 24px",
                  background:T.surface,border:`1px solid ${T.line}`,
                  display:"flex",alignItems:"center",
                  justifyContent:"space-between",gap:"16px"}}>
                  <div>
                    <h1 style={{fontSize:"20px",fontWeight:600,
                      fontFamily:"'Lora',serif",color:T.ink,margin:0,lineHeight:1.3}}>
                      {greet()}, Scholar ✨
                    </h1>
                    <p style={{color:T.inkLight,marginTop:"5px",fontSize:"13px",lineHeight:1.6}}>
                      Welcome back to{" "}
                      <strong style={{color:T.terra}}>BrightPlace</strong> —{" "}
                      {activeQuests.length > 0
                        ? `you have ${activeQuests.length} quest${activeQuests.length>1?"s":""} waiting.`
                        : "your board is clear. Add something new."}
                    </p>
                    <div style={{display:"flex",gap:"8px",marginTop:"12px",flexWrap:"wrap"}}>
                      {[
                        { label:`${streak} day streak 🔥`, c:T.terra },
                        { label:`${doneQuests.length} done`,  c:T.sage  },
                        { label:`${coins} coins`,             c:T.inkLight},
                      ].map((pill,i) => (
                        <span key={i} style={{fontSize:"11px",fontWeight:700,color:pill.c,
                          background:T.surface2,padding:"3px 10px",borderRadius:"999px",
                          border:`1px solid ${T.line}`}}>
                          {pill.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{fontSize:"44px",flexShrink:0,opacity:0.8}}>🧠</div>
                </div>

                {/* Stats */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"10px"}}>
                  {[
                    { label:"Active quests", value:activeQuests.length, accent:T.terra },
                    { label:"Bright Coins",  value:coins,               accent:T.terra },
                    { label:"Day streak",    value:streak,              accent:T.sage  },
                    { label:"Quests done",   value:doneQuests.length,   accent:T.sage  },
                  ].map((s,i) => (
                    <div key={i} style={{borderRadius:"12px",padding:"16px",textAlign:"center",
                      background:T.surface,border:`1px solid ${T.line}`}}>
                      <div style={{fontSize:"26px",fontWeight:800,color:s.accent,lineHeight:1,
                        fontFamily:"'Space Mono',monospace"}}>
                        {s.value}
                      </div>
                      <div style={{fontSize:"11px",color:T.inkFaint,fontWeight:600,marginTop:"5px"}}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Today's classes */}
                {!focusMode && (
                  <div>
                    <SectionLabel>Today's classes</SectionLabel>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(275px,1fr))",gap:"10px"}}>
                      {classes.slice(0,2).map(cls => <ClassCard key={cls.id} cls={cls}/>)}
                    </div>
                  </div>
                )}

                {/* Quests preview */}
                <div>
                  <div style={{display:"flex",alignItems:"center",
                    justifyContent:"space-between",marginBottom:"10px"}}>
                    <SectionLabel>Active quests</SectionLabel>
                    <button onClick={() => setActiveTab("quests")}
                      style={{display:"flex",alignItems:"center",gap:"4px",
                        background:"transparent",border:"none",color:T.terra,
                        cursor:"pointer",fontWeight:700,fontSize:"12px",
                        fontFamily:"'Nunito',sans-serif",marginBottom:"10px"}}>
                      See all <ChevronRight size={13}/>
                    </button>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                    {activeQuests.slice(0,3).map(q => (
                      <QuestCard key={q.id} quest={q}
                        onComplete={completeQuest} onDelete={deleteQuest}/>
                    ))}
                    {activeQuests.length === 0 && (
                      <div style={{textAlign:"center",padding:"26px",color:T.inkFaint,
                        background:T.surface,borderRadius:"12px",
                        border:`1px dashed ${T.lineMed}`,fontSize:"13px"}}>
                        All clear — add a quest from the Quest Board
                      </div>
                    )}
                  </div>
                </div>

                {/* ADHD tip */}
                {!focusMode && (
                  <div style={{borderRadius:"14px",padding:"16px 18px",
                    background:T.surface,border:`1px solid ${T.line}`,
                    display:"flex",alignItems:"start",gap:"12px"}}>
                    <div style={{width:"32px",height:"32px",borderRadius:"10px",flexShrink:0,
                      background:T.sageBg,display:"flex",alignItems:"center",
                      justifyContent:"center",marginTop:"1px"}}>
                      <Brain size={16} color={T.sage}/>
                    </div>
                    <div>
                      <div style={{fontSize:"10px",fontWeight:800,color:T.sage,
                        textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"4px"}}>
                        ADHD tip
                      </div>
                      <div style={{fontSize:"13px",color:T.inkLight,lineHeight:1.65}}>
                        The hardest part is starting. Set a 2-minute timer and just{" "}
                        <em>open</em> the assignment — the rest usually follows on its own.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── QUESTS ──────────────────────────────────── */}
            {activeTab === "quests" && (
              <div className="page" style={{display:"flex",flexDirection:"column",
                gap:"18px",maxWidth:"660px"}}>

                <div style={{display:"flex",alignItems:"center",
                  justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
                  <div>
                    <h1 style={{fontSize:"20px",fontWeight:600,fontFamily:"'Lora',serif",
                      color:T.ink,margin:0}}>Quest Board</h1>
                    <p style={{color:T.inkFaint,fontSize:"12px",marginTop:"3px"}}>
                      Because "to-do list" doesn't spark joy
                    </p>
                  </div>
                  <button onClick={() => setShowAddQuest(v => !v)}
                    className="pri-btn"
                    style={{display:"flex",alignItems:"center",gap:"7px",
                      padding:"9px 16px",borderRadius:"10px",border:"none",
                      background:T.sage,color:"#fff",cursor:"pointer",
                      fontFamily:"'Nunito',sans-serif",fontWeight:800,
                      fontSize:"13px",transition:"background 0.15s"}}>
                    <Plus size={14}/>New quest
                  </button>
                </div>

                {showAddQuest && (
                  <div className="page" style={{borderRadius:"14px",padding:"18px",
                    background:T.surface,border:`1px solid ${T.lineMed}`}}>
                    <div style={{fontWeight:800,color:T.ink,marginBottom:"14px",fontSize:"14px"}}>
                      New quest
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                      <input value={newQuest.title}
                        onChange={e => setNewQuest({...newQuest,title:e.target.value})}
                        placeholder="Name it (e.g. 'Vanquish the essay dragon')"
                        style={inputStyle}/>
                      <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                        {[
                          {d:"easy",   label:"Low effort"  },
                          {d:"medium", label:"Some effort" },
                          {d:"hard",   label:"Deep work"   },
                        ].map(({d,label}) => {
                          const sel = newQuest.difficulty === d;
                          return (
                            <button key={d} onClick={() => setNewQuest({...newQuest,difficulty:d})}
                              style={{padding:"7px 14px",borderRadius:"8px",
                                border:`1px solid ${sel ? T.sage : T.lineMed}`,
                                background:sel ? T.sageBg : "transparent",
                                color:sel ? T.sage : T.inkLight,cursor:"pointer",
                                fontFamily:"'Nunito',sans-serif",fontWeight:700,
                                fontSize:"12px",transition:"all 0.15s"}}>
                              {label}
                            </button>
                          );
                        })}
                        <input value={newQuest.deadline}
                          onChange={e => setNewQuest({...newQuest,deadline:e.target.value})}
                          placeholder="Due date (optional)"
                          style={{...inputStyle,width:"auto",flex:1,minWidth:"130px"}}/>
                      </div>
                      <div style={{display:"flex",gap:"8px"}}>
                        <button onClick={addQuest}
                          style={{padding:"9px 20px",borderRadius:"9px",border:"none",
                            background:T.sage,color:"#fff",cursor:"pointer",
                            fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:"13px"}}>
                          Add quest
                        </button>
                        <button onClick={() => setShowAddQuest(false)}
                          style={{padding:"9px 14px",borderRadius:"9px",
                            border:`1px solid ${T.lineMed}`,background:"transparent",
                            color:T.inkLight,cursor:"pointer",
                            fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"13px"}}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <SectionLabel>Active · {activeQuests.length}</SectionLabel>
                  <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                    {activeQuests.map(q => (
                      <QuestCard key={q.id} quest={q}
                        onComplete={completeQuest} onDelete={deleteQuest}/>
                    ))}
                    {activeQuests.length === 0 && (
                      <div style={{textAlign:"center",padding:"32px",color:T.inkFaint,
                        background:T.surface,borderRadius:"12px",
                        border:`1px dashed ${T.lineMed}`,fontSize:"13px"}}>
                        All quests complete — add another one
                      </div>
                    )}
                  </div>
                </div>

                {doneQuests.length > 0 && (
                  <div>
                    <SectionLabel>Completed · {doneQuests.length}</SectionLabel>
                    <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                      {doneQuests.map(q => (
                        <QuestCard key={q.id} quest={q}
                          onComplete={completeQuest} onDelete={deleteQuest}/>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── SCHEDULE ────────────────────────────────── */}
            {activeTab === "schedule" && (
              <div className="page" style={{display:"flex",flexDirection:"column",
                gap:"18px",maxWidth:"800px"}}>

                <div>
                  <h1 style={{fontSize:"20px",fontWeight:600,fontFamily:"'Lora',serif",
                    color:T.ink,margin:0}}>My Schedule</h1>
                  <p style={{color:T.inkFaint,fontSize:"12px",marginTop:"3px"}}>
                    30 min notice for in-person · 5 min for online — time blindness, handled.
                  </p>
                </div>

                <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                  {[
                    { icon:MapPin,      label:"In-person" },
                    { icon:Wifi,        label:"Online"    },
                    { icon:AlertCircle, label:"Urgent"    },
                  ].map((item,i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} style={{display:"flex",alignItems:"center",gap:"6px",
                        padding:"5px 12px",borderRadius:"999px",
                        background:T.surface,border:`1px solid ${T.lineMed}`,
                        fontSize:"12px",fontWeight:600,
                        color:i===2 ? T.terra : T.sage}}>
                        <Icon size={11}/>{item.label}
                      </div>
                    );
                  })}
                </div>

                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(285px,1fr))",gap:"10px"}}>
                  {classes.map(cls => <ClassCard key={cls.id} cls={cls}/>)}
                </div>

                <div style={{borderRadius:"14px",padding:"18px",
                  background:T.surface,border:`1px solid ${T.line}`}}>
                  <div style={{fontWeight:800,color:T.ink,marginBottom:"12px",fontSize:"14px",
                    display:"flex",alignItems:"center",gap:"7px"}}>
                    <Timer size={14} color={T.sage}/>Time blindness toolkit
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                    {[
                      { emoji:"🚶", label:"Arts Building",  note:"8 min walk from dorms" },
                      { emoji:"🚌", label:"Science Hall",   note:"14 min via Bus #12"    },
                      { emoji:"💻", label:"Online classes", note:"Open Zoom 5 min early" },
                    ].map((item,i) => (
                      <div key={i} style={{display:"flex",alignItems:"center",gap:"12px",
                        padding:"10px 14px",borderRadius:"10px",background:T.bg}}>
                        <span style={{fontSize:"17px"}}>{item.emoji}</span>
                        <div>
                          <div style={{fontWeight:700,color:T.ink,fontSize:"13px"}}>{item.label}</div>
                          <div style={{fontSize:"11px",color:T.sage,marginTop:"1px"}}>{item.note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── REWARDS ─────────────────────────────────── */}
            {activeTab === "rewards" && (
              <div className="page" style={{display:"flex",flexDirection:"column",
                gap:"18px",maxWidth:"720px"}}>

                <div style={{display:"flex",alignItems:"start",justifyContent:"space-between",
                  flexWrap:"wrap",gap:"12px"}}>
                  <div>
                    <h1 style={{fontSize:"20px",fontWeight:600,fontFamily:"'Lora',serif",
                      color:T.ink,margin:0}}>Reward Store</h1>
                    <p style={{color:T.inkFaint,fontSize:"12px",marginTop:"3px"}}>
                      Spend what you've earned — dopamine loop, complete
                    </p>
                  </div>
                  <div style={{borderRadius:"12px",padding:"11px 16px",
                    background:T.surface,border:`1px solid ${T.lineMed}`,
                    display:"flex",alignItems:"center",gap:"8px"}}>
                    <Coins size={18} color={T.terra}/>
                    <div>
                      <div style={{fontSize:"20px",fontWeight:800,color:T.terra,lineHeight:1,
                        fontFamily:"'Space Mono',monospace"}}>{coins}</div>
                      <div style={{fontSize:"10px",color:T.inkFaint,fontWeight:700}}>Bright Coins</div>
                    </div>
                  </div>
                </div>

                {/* Dopamine bar */}
                <div style={{borderRadius:"14px",padding:"16px 18px",
                  background:T.surface,border:`1px solid ${T.line}`}}>
                  <div style={{fontWeight:700,color:T.ink,marginBottom:"6px",fontSize:"13px"}}>
                    Complete 5 quests to unlock a bonus multiplier
                  </div>
                  <div style={{height:"8px",background:T.surface2,borderRadius:"999px",
                    overflow:"hidden",marginBottom:"6px"}}>
                    <div style={{height:"100%",borderRadius:"999px",background:T.sage,
                      width:`${Math.min((doneQuests.length/5)*100,100)}%`,
                      transition:"width 0.6s ease"}}/>
                  </div>
                  <div style={{fontSize:"11px",color:T.sage,fontWeight:700}}>
                    {doneQuests.length}/5 quests done
                    {doneQuests.length >= 5 && " · Multiplier active!"}
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))",gap:"10px"}}>
                  {rewards.map(r => <RewardCard key={r.id} reward={r} coins={coins} onBuy={buyReward}/>)}
                </div>

                <div style={{textAlign:"center",padding:"13px",
                  background:T.surface,borderRadius:"12px",
                  border:`1px dashed ${T.lineMed}`,fontSize:"12px",color:T.inkFaint}}>
                  The best rewards are personal — write your own and spend coins to unlock them
                </div>
              </div>
            )}

            {/* ── RESOURCES ───────────────────────────────── */}
            {activeTab === "resources" && (
              <div className="page" style={{display:"flex",flexDirection:"column",
                gap:"18px",maxWidth:"820px"}}>

                <div>
                  <h1 style={{fontSize:"20px",fontWeight:600,fontFamily:"'Lora',serif",
                    color:T.ink,margin:0}}>Content Library</h1>
                  <p style={{color:T.inkFaint,fontSize:"12px",marginTop:"3px"}}>
                    Curated for ADHD brains — no wall of text, we promise
                  </p>
                </div>

                <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                  {["All","Study Tips","Focus Music","Campus Guide"].map(cat => (
                    <button key={cat}
                      style={{padding:"6px 14px",borderRadius:"999px",
                        border:`1px solid ${T.lineMed}`,background:T.surface,
                        color:T.inkLight,cursor:"pointer",
                        fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"12px",
                        transition:"all 0.15s"}}
                      onMouseEnter={e=>{e.currentTarget.style.color=T.sage;e.currentTarget.style.borderColor=T.sageDim;}}
                      onMouseLeave={e=>{e.currentTarget.style.color=T.inkLight;e.currentTarget.style.borderColor=T.lineMed;}}>
                      {cat}
                    </button>
                  ))}
                </div>

                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(192px,1fr))",gap:"10px"}}>
                  {resources.map(r => <ResourceCard key={r.id} item={r}/>)}
                </div>

                <div style={{borderRadius:"16px",padding:"18px",
                  background:T.surface,border:`1px solid ${T.line}`}}>
                  <div style={{fontWeight:800,color:T.ink,marginBottom:"14px",fontSize:"14px",
                    display:"flex",alignItems:"center",gap:"7px"}}>
                    <Lightbulb size={14} color={T.sage}/>Quick ADHD wins
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(196px,1fr))",gap:"8px"}}>
                    {[
                      "📱 Phone in another room while studying",
                      "🎧 Noise-cancelling headphones = focus zone",
                      "🍅 Set a 15-min timer — just start",
                      "🏃 5-min walk when your brain stalls",
                      "✍️ Write tasks on paper first, then here",
                      "🌡️ A slightly cool room helps focus",
                    ].map((tip,i) => (
                      <div key={i} style={{background:T.bg,borderRadius:"10px",
                        padding:"9px 12px",fontSize:"12px",color:T.inkLight,
                        fontWeight:600,lineHeight:1.5,border:`1px solid ${T.line}`}}>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* ── FOOTER ──────────────────────────────────────── */}
        {!focusMode && (
          <footer style={{height:"30px",flexShrink:0,
            background:T.surface,borderTop:`1px solid ${T.line}`,
            display:"flex",alignItems:"center",padding:"0 20px",gap:"16px"}}>
            <span style={{fontSize:"10px",color:T.inkFaint,fontWeight:700}}>
              © 2025 BrightPlace · Built for ADHD minds
            </span>
            <span style={{fontSize:"10px",color:T.inkFaint,opacity:0.55}}>
              Not affiliated with D2L · Just inspired by the chaos
            </span>
            <span style={{marginLeft:"auto",fontSize:"10px",color:T.inkFaint}}>
              Focus. Quest. Thrive.
            </span>
          </footer>
        )}

      </div>
    </>
  );
}
