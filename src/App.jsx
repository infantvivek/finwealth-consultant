import React, { useState, useMemo } from 'react';
import { 
  Calculator, TrendingUp, PieChart, ShieldCheck, 
  Target, Landmark, Wallet, Clock, ArrowRightLeft, Coins
} from 'lucide-react';

const App = () => {
  // core inputs
  const [monthlyInvest, setMonthlyInvest] = useState(5000);
  const [tenure, setTenure] = useState(20);
  const [stepUp, setStepUp] = useState(10);
  const [age, setAge] = useState(30);
  const [riskProfile, setRiskProfile] = useState('moderate');
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(30000);

  const riskConfig = {
    conservative: { 
      cagr: 8, 
      split: [
        { cat: "Liquid/Debt Funds", pc: 50, color: "bg-slate-400" },
        { cat: "Large Cap Index", pc: 35, color: "bg-blue-500" },
        { cat: "Gold Funds", pc: 15, color: "bg-yellow-500" }
      ]
    },
    moderate: { 
      cagr: 12, 
      split: [
        { cat: "Flexi-cap Funds", pc: 50, color: "bg-emerald-500" },
        { cat: "Nifty 50 Index", pc: 30, color: "bg-blue-600" },
        { cat: "Dynamic Bond Funds", pc: 20, color: "bg-slate-500" }
      ]
    },
    aggressive: { 
      cagr: 15, 
      split: [
        { cat: "Small Cap Funds", pc: 40, color: "bg-purple-600" },
        { cat: "Mid Cap Funds", pc: 40, color: "bg-indigo-600" },
        { cat: "Nasdaq 100/Tech", pc: 20, color: "bg-pink-600" }
      ]
    }
  };

  const results = useMemo(() => {
    // Accumulation Phase
    let totalInvested = 0;
    let maturityValue = 0;
    let currentSIP = monthlyInvest;
    const expectedReturn = riskConfig[riskProfile].cagr;
    const monthlyRate = (expectedReturn / 100) / 12;

    for (let year = 1; year <= tenure; year++) {
      for (let month = 1; month <= 12; month++) {
        totalInvested += currentSIP;
        const monthsRemaining = (tenure * 12) - ((year - 1) * 12 + month) + 1;
        maturityValue += currentSIP * Math.pow(1 + monthlyRate, monthsRemaining);
      }
      currentSIP *= (1 + stepUp / 100);
    }

    const gains = maturityValue - totalInvested;
    const tax = Math.max(0, gains - 125000) * 0.125;
    const postTaxWealth = maturityValue - tax;
    
    // SWP logic
    const swpRate = 0.08 / 12; 
    let monthsLasted = 0;
    let tempCorpus = postTaxWealth;
    while (tempCorpus >= monthlyWithdrawal && monthsLasted < 600) {
      tempCorpus = (tempCorpus * (1 + swpRate)) - monthlyWithdrawal;
      monthsLasted++;
    }

    return {
      invested: Math.round(totalInvested),
      preTaxNetWorth: Math.round(maturityValue),
      tax: Math.round(tax),
      postTaxWealth: Math.round(postTaxWealth),
      swpYears: (monthsLasted / 12).toFixed(1),
      isPerpetual: monthsLasted >= 600,
      fundSplit: riskConfig[riskProfile].split.map(s => ({
        ...s,
        amt: Math.round((monthlyInvest * s.pc) / 100)
      }))
    };
  }, [monthlyInvest, tenure, stepUp, riskProfile, monthlyWithdrawal]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center gap-3 mb-10">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg"><Landmark size={28} /></div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">FinConsult <span className="text-blue-600">Pro</span></h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Core Inputs & Profile */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-600" /> User Profile
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Current Age</label>
                    <input type="number" value={age} onChange={(e)=>setAge(Number(e.target.value))} className="w-full bg-transparent font-bold text-lg outline-none" />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">SIP Duration</label>
                    <input type="number" value={tenure} onChange={(e)=>setTenure(Number(e.target.value))} className="w-full bg-transparent font-bold text-lg outline-none" />
                  </div>
                </div>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
                  {['conservative', 'moderate', 'aggressive'].map((p) => (
                    <button key={p} onClick={() => setRiskProfile(p)}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${
                        riskProfile === p ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'
                      }`}>{p}</button>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Calculator size={18} className="text-emerald-600" /> SIP Configuration
              </h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2"><span className="text-xs font-bold">Monthly Capacity</span><span className="font-bold text-blue-600">₹{monthlyInvest.toLocaleString('en-IN')}</span></div>
                  <input type="range" min="1000" max="100000" step="1000" value={monthlyInvest} onChange={(e)=>setMonthlyInvest(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <div className="flex justify-between mb-2"><span className="text-xs font-bold">Annual Step-Up</span><span className="font-bold text-emerald-600">{stepUp}%</span></div>
                  <input type="range" min="0" max="20" value={stepUp} onChange={(e)=>setStepUp(Number(e.target.value))} className="w-full accent-emerald-500" />
                </div>
              </div>
            </section>
          </div>

          {/* Column 2: Diversification & Split */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl h-full">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <ArrowRightLeft size={18} className="text-blue-400" /> Investment Split
              </h2>
              
              <div className="space-y-5">
                {results.fundSplit.map((item, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">{item.cat}</p>
                        <p className="text-sm font-bold group-hover:text-blue-400 transition-colors">₹{item.amt.toLocaleString('en-IN')}/mo</p>
                      </div>
                      <span className="text-xs font-black opacity-40">{item.pc}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.pc}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Coins className="text-yellow-500" size={20}/>
                  <p className="text-xs font-bold">Why this split?</p>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  Based on your {riskProfile} profile, we've optimized for {riskConfig[riskProfile].cagr}% CAGR. 
                  {age > 45 ? " We've increased debt weightage to protect your capital as you near the withdrawal phase." : " We've maximized equity exposure to leverage compounding time."}
                </p>
              </div>
            </section>
          </div>

          {/* Column 3: Wealth & SWP Results */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Target size={18} className="text-blue-600" /> Wealth Projection
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-xs text-slate-500">Maturity Age</span>
                  <span className="text-xs font-bold">{age + tenure} Years</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-xs text-slate-500">Gross Value</span>
                  <span className="text-xs font-bold">₹{results.preTaxNetWorth.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center bg-blue-600 p-4 rounded-2xl text-white shadow-lg">
                  <span className="text-xs font-bold uppercase opacity-80">Post-Tax</span>
                  <span className="text-2xl font-black">₹{results.postTaxWealth.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </section>

            <section className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl">
              <h2 className="text-sm font-bold text-indigo-200 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Wallet size={18} /> Retirement SWP
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase opacity-70 block mb-2">Desired Monthly Payout</label>
                  <input type="number" value={monthlyWithdrawal} onChange={(e)=>setMonthlyWithdrawal(Number(e.target.value))} 
                    className="w-full bg-indigo-700/50 p-3 rounded-xl outline-none font-black text-xl border border-indigo-500/50 mb-4" />
                </div>
                <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                  <p className="text-[10px] font-bold uppercase opacity-70 mb-1">Fund Sustainability</p>
                  <p className="text-3xl font-black">{results.isPerpetual ? "Forever ∞" : `${results.swpYears} Years`}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
