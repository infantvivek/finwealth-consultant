import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Calculator, TrendingUp, PieChart, ShieldCheck, 
  Target, Landmark, Wallet, ArrowRightLeft, Send, Bot, 
  ArrowUpRight, Info, AlertCircle, Layers
} from 'lucide-react';

const App = () => {
  // --- Global State ---
  const [monthlyInvest, setMonthlyInvest] = useState(10000);
  const [tenure, setTenure] = useState(20);
  const [age, setAge] = useState(30);
  const [riskProfile, setRiskProfile] = useState('moderate');
  const [stepUp, setStepUp] = useState(10);
  
  // --- AI Chat State ---
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Namaste! I've loaded your plan. You can ask me for fund names, tax advice, or 'Compare 12% vs 14%' to see the wealth gap. How can I assist?" }
  ]);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef(null);

  // --- Real-time Calculation Logic ---
  const calculateMaturity = (rate) => {
    let maturity = 0;
    let currentSIP = monthlyInvest;
    const monthlyRate = (rate / 100) / 12;
    for (let yr = 1; yr <= tenure; yr++) {
      for (let mo = 1; mo <= 12; mo++) {
        const remaining = (tenure * 12) - ((yr - 1) * 12 + mo) + 1;
        maturity += currentSIP * Math.pow(1 + monthlyRate, remaining);
      }
      currentSIP *= (1 + stepUp / 100);
    }
    return Math.round(maturity);
  };

  const currentCAGR = riskProfile === 'conservative' ? 8 : riskProfile === 'moderate' ? 12 : 15;
  const mainMaturity = calculateMaturity(currentCAGR);
  const comparisonMaturity = calculateMaturity(currentCAGR + 2); // Show +2% benefit

  const handleChat = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMsgs = [...messages, { role: 'user', text: userInput }];
    setMessages(newMsgs);
    const query = userInput.toLowerCase();
    setUserInput('');

    setTimeout(() => {
      let botResponse = "";
      if (query.includes("compare")) {
        botResponse = `If you pick a fund yielding ${currentCAGR + 2}% instead of ${currentCAGR}%, your wealth grows from ₹${(mainMaturity/10000000).toFixed(2)} Cr to ₹${(comparisonMaturity/10000000).toFixed(2)} Cr. That is a difference of ₹${((comparisonMaturity - mainMaturity)/100000).toFixed(0)} Lakhs!`;
      } else if (query.includes("flexi cap")) {
        botResponse = "Top 2026 Flexi Caps: 1. Parag Parikh (Value focus), 2. HDFC (Growth focus), 3. Quant (Momentum). Based on your " + riskProfile + " profile, Parag Parikh is the safest starting point.";
      } else if (query.includes("tax")) {
        botResponse = "Current 2026 LTCG: 12.5% on gains > ₹1.25L. Pro tip: Redeem ₹1.25L worth of gains every March and reinvest immediately to 'reset' your purchase price and pay zero tax on that portion.";
      } else {
        botResponse = "Understood. For a " + age + "-year-old, I'd suggest ensuring at least 20% is in International or Tech funds to diversify away from Indian market volatility. Should I list some funds?";
      }
      setMessages([...newMsgs, { role: 'bot', text: botResponse }]);
    }, 600);
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Master Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-blue-600 uppercase mb-6 flex items-center gap-2">
              <Calculator size={18} /> Investment Engine
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Age</label>
                  <input type="number" value={age} onChange={(e)=>setAge(Number(e.target.value))} className="w-full bg-transparent font-bold text-lg outline-none" />
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Years</label>
                  <input type="number" value={tenure} onChange={(e)=>setTenure(Number(e.target.value))} className="w-full bg-transparent font-bold text-lg outline-none" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2 text-xs font-bold"><span>Monthly SIP</span><span>₹{monthlyInvest.toLocaleString('en-IN')}</span></div>
                <input type="range" min="1000" max="100000" step="1000" value={monthlyInvest} onChange={(e)=>setMonthlyInvest(Number(e.target.value))} className="w-full accent-blue-600" />
              </div>
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                {['conservative', 'moderate', 'aggressive'].map(p => (
                  <button key={p} onClick={() => setRiskProfile(p)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase ${riskProfile === p ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>{p}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xs font-bold text-slate-400 uppercase">Comparison Alpha</h3>
               <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded-full">+2% Edge</span>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <p className="text-[10px] text-slate-400">Standard ({currentCAGR}%)</p>
                  <p className="font-bold">₹{(mainMaturity/10000000).toFixed(2)} Cr</p>
               </div>
               <div className="flex justify-between items-end">
                  <p className="text-[10px] text-blue-400 font-bold">Optimized ({currentCAGR+2}%)</p>
                  <p className="font-bold text-blue-400">₹{(comparisonMaturity/10000000).toFixed(2)} Cr</p>
               </div>
               <div className="h-1 w-full bg-slate-800 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{width: `${(mainMaturity/comparisonMaturity)*100}%`}}></div></div>
            </div>
          </div>
        </div>

        {/* MIDDLE: Fund Split & Strategy */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full">
            <h2 className="text-sm font-bold text-emerald-600 uppercase mb-6 flex items-center gap-2">
              <Layers size={18} /> Diversification Split
            </h2>
            <div className="space-y-6">
               <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    At age {age}, your "Safe-to-Aggressive" ratio is optimized. We've allocated ₹{Math.round(monthlyInvest * 0.7)} to Equity for growth and ₹{Math.round(monthlyInvest * 0.3)} to Debt/Gold for stability.
                  </p>
               </div>
               
               <div className="space-y-4 pt-4 text-xs">
                  <div className="flex justify-between items-center"><span className="text-slate-500">Core: Flexi & Index</span><span className="font-bold">60%</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-500">Growth: Small/Mid Cap</span><span className="font-bold">25%</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-500">Stability: Debt & Gold</span><span className="font-bold">15%</span></div>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT: AI Advisor Bot */}
        <div className="lg:col-span-4 flex flex-col h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="text-blue-400" size={24} />
              <div><p className="text-sm font-bold">Advisor AI</p><p className="text-[10px] opacity-60">Realtime 2026 Analysis</p></div>
            </div>
            <Info size={16} className="opacity-40" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleChat} className="p-4 border-t bg-white flex gap-2">
            <input type="text" value={userInput} onChange={(e)=>setUserInput(e.target.value)} placeholder="Compare 12% vs 15%..." className="flex-1 p-3 bg-slate-100 rounded-xl outline-none text-xs focus:ring-1 focus:ring-blue-500" />
            <button type="submit" className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"><Send size={16} /></button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default App;
