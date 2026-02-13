import React, { useState, useMemo } from 'react';
import { 
  Calculator, TrendingUp, PieChart, MessageSquare, 
  ArrowUpRight, ShieldCheck, Info, Target, Landmark 
} from 'lucide-react';

const App = () => {
  // --- State Management ---
  const [monthlyInvest, setMonthlyInvest] = useState(10000);
  const [tenure, setTenure] = useState(20);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [stepUp, setStepUp] = useState(10);
  const [age, setAge] = useState(30);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Namaste! I'm your 2026 Wealth Consultant. I've analyzed the current market: Inflation is at 6% and LTCG is 12.5%. Let's plan your freedom." }
  ]);

  // --- Financial Calculation Logic ---
  const results = useMemo(() => {
    let totalInvested = 0;
    let maturityValue = 0;
    let currentSIP = monthlyInvest;
    const monthlyRate = (expectedReturn / 100) / 12;

    for (let year = 1; year <= tenure; year++) {
      for (let month = 1; month <= 12; month++) {
        totalInvested += currentSIP;
        const monthsRemaining = (tenure * 12) - ((year - 1) * 12 + month) + 1;
        maturityValue += currentSIP * Math.pow(1 + monthlyRate, monthsRemaining);
      }
      currentSIP *= (1 + stepUp / 100); // Annual Step-up
    }

    const gains = maturityValue - totalInvested;
    const taxableGains = Math.max(0, gains - 125000); // 1.25L Exemption
    const tax = taxableGains * 0.125; // 12.5% LTCG

    return {
      invested: Math.round(totalInvested),
      maturity: Math.round(maturityValue),
      gains: Math.round(gains),
      tax: Math.round(tax),
      net: Math.round(maturityValue - tax)
    };
  }, [monthlyInvest, tenure, expectedReturn, stepUp]);

  // --- AI Consultant Logic ---
  const handleChat = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);

    // Simulated Financial Advisory Logic
    setTimeout(() => {
      let response = "That's a valid concern. Given your age of " + age + ", I recommend a mix of 70% Index Funds and 30% Debt/Gold.";
      if (input.toLowerCase().includes('tax')) {
        response = "For 2026, the LTCG tax is 12.5%. I suggest 'Tax Harvesting'—selling units annually to realize ₹1.25L in gains tax-free.";
      } else if (input.toLowerCase().includes('retirement')) {
        const corpusNeeded = (results.invested * 3); // Simplified 2026 logic
        response = `To retire by 60, you need roughly ₹${(corpusNeeded/10000000).toFixed(2)} Crore. Your current plan reaches ₹${(results.net/10000000).toFixed(2)} Crore. Consider increasing step-up to 12%.`;
      }
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    }, 600);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Landmark size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">FinConsult 2026</h1>
              <p className="text-slate-500 text-sm font-medium">Strategic Mutual Fund Planning</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Market: Bullish</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Tax: 12.5% LTCG</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Calculator size={20} className="text-blue-600" /> Investment Logic
              </h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-600">Starting Monthly SIP</label>
                    <span className="text-blue-600 font-bold">₹{monthlyInvest.toLocaleString('en-IN')}</span>
                  </div>
                  <input type="range" min="1000" max="100000" step="1000" value={monthlyInvest} 
                    onChange={(e) => setMonthlyInvest(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-600 flex items-center gap-1">
                      Annual Step-Up <ArrowUpRight size={14} className="text-emerald-500"/>
                    </label>
                    <span className="text-emerald-600 font-bold">{stepUp}%</span>
                  </div>
                  <input type="range" min="0" max="25" step="1" value={stepUp} 
                    onChange={(e) => setStepUp(Number(e.target.value))} className="w-full accent-emerald-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Duration (Yrs)</label>
                    <input type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 outline-none font-bold focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Current Age</label>
                    <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 outline-none font-bold focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <PieChart size={16} /> Diversification Strategy
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Equity Funds ({100-age}%)</span>
                    <span className="text-blue-400">₹{Math.round(monthlyInvest * ((100-age)/100)).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-700" style={{width: `${100-age}%`}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1 text-slate-400">
                    <span>Debt & Gold ({age}%)</span>
                    <span>₹{Math.round(monthlyInvest * (age/100)).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col">
              <h2 className="text-lg font-bold mb-8 flex items-center gap-2">
                <Target size={20} className="text-emerald-600" /> Wealth Goal
              </h2>
              
              <div className="space-y-8 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Invested</p>
                    <p className="text-lg font-bold">₹{(results.invested/100000).toFixed(1)}L</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Est. Returns</p>
                    <p className="text-lg font-bold text-emerald-700">₹{(results.gains/100000).toFixed(1)}L</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex justify-between text-slate-500 text-sm mb-2">
                    <span>Total Value</span>
                    <span className="font-bold text-slate-900">₹{results.maturity.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-red-500 text-xs mb-6">
                    <span className="flex items-center gap-1 italic">Est. 12.5% LTCG Tax <Info size={12}/></span>
                    <span className="font-bold">- ₹{results.tax.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl text-white text-center shadow-xl">
                    <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">In-Hand Wealth</p>
                    <p className="text-3xl font-black">₹{(results.net/10000000).toFixed(2)} Cr</p>
                    <p className="text-[10px] opacity-60 mt-2">Adjusted for 2026 Tax Slab</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>Consultant Tip:</strong> A {stepUp}% annual step-up increases your final corpus by {(((results.net / (monthlyInvest * 12 * tenure)) - 1) * 100).toFixed(0)}% compared to a flat SIP.
                </p>
              </div>
            </div>
          </div>

          {/* AI Chatbot Section */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
              <div className="p-5 border-b flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <h3 className="font-bold text-sm text-slate-700">Financial AI Assistant</h3>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                      msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-md' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleChat} className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-2">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about retirement or tax..." 
                    className="flex-1 p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 font-bold transition-all shadow-md active:scale-95">
                    Ask
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
