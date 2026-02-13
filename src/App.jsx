import React, { useState, useMemo, useRef } from 'react';
import { 
  Calculator, TrendingUp, PieChart, ArrowUpRight, 
  ShieldCheck, Info, Target, Landmark, Download, Eye, Wallet, Clock 
} from 'lucide-react';

const App = () => {
  // Existing States
  const [monthlyInvest, setMonthlyInvest] = useState(10000);
  const [tenure, setTenure] = useState(20);
  const [stepUp, setStepUp] = useState(10);
  const [age, setAge] = useState(30);
  const [riskProfile, setRiskProfile] = useState('moderate');
  
  // SWP States
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(50000);

  const riskConfig = {
    conservative: { cagr: 8, funds: ["SBI Bluechip", "HDFC Corp Bond"], color: "text-blue-600" },
    moderate: { cagr: 12, funds: ["Parag Parikh Flexi Cap", "Nifty 50 Index"], color: "text-emerald-600" },
    aggressive: { cagr: 15, funds: ["Quant Small Cap", "Nippon Growth"], color: "text-purple-600" }
  };

  const results = useMemo(() => {
    // 1. Accumulation Phase (SIP)
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
    
    // 2. Withdrawal Phase (SWP)
    // We assume a more conservative 8% return during withdrawal phase for safety
    const swpRate = 0.08 / 12; 
    let monthsLasted = 0;
    let tempCorpus = postTaxWealth;
    
    // Calculate how many months the fund lasts
    while (tempCorpus >= monthlyWithdrawal && monthsLasted < 600) { // Cap at 50 years
      tempCorpus = (tempCorpus * (1 + swpRate)) - monthlyWithdrawal;
      monthsLasted++;
    }

    return {
      invested: Math.round(totalInvested),
      preTaxNetWorth: Math.round(maturityValue),
      tax: Math.round(tax),
      postTaxWealth: Math.round(postTaxWealth),
      swpMonths: monthsLasted,
      swpYears: (monthsLasted / 12).toFixed(1),
      isPerpetual: monthsLasted >= 600
    };
  }, [monthlyInvest, tenure, stepUp, riskProfile, monthlyWithdrawal]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Landmark className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold tracking-tight">FinConsult 2026</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: SIP & Risk Config */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Calculator size={20} className="text-blue-600" /> SIP Phase
              </h2>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl mb-6">
                {Object.keys(riskConfig).map((profile) => (
                  <button key={profile} onClick={() => setRiskProfile(profile)}
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
                      riskProfile === profile ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'
                    }`}>{profile}</button>
                ))}
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">Monthly SIP: ₹{monthlyInvest.toLocaleString('en-IN')}</label>
                  <input type="range" min="5000" max="200000" step="5000" value={monthlyInvest} onChange={(e)=>setMonthlyInvest(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">Annual Step-Up: {stepUp}%</label>
                  <input type="range" min="0" max="20" value={stepUp} onChange={(e)=>setStepUp(Number(e.target.value))} className="w-full accent-emerald-500" />
                </div>
              </div>
            </section>

            {/* SWP Input Card */}
            <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm ring-2 ring-blue-50">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Wallet size={20} className="text-indigo-600" /> Withdrawal Phase
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">Desired Monthly Withdrawal</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-slate-800">₹</span>
                    <input 
                      type="number" 
                      value={monthlyWithdrawal} 
                      onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))}
                      className="w-full text-xl font-black text-slate-800 bg-transparent outline-none border-b-2 border-slate-100 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <input type="range" min="10000" max="500000" step="5000" value={monthlyWithdrawal} onChange={(e)=>setMonthlyWithdrawal(Number(e.target.value))} className="w-full mt-4 accent-indigo-600" />
                </div>
              </div>
            </section>
          </div>

          {/* Center Column: Maturity & Tax */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Target className="text-emerald-600" /> Results</h2>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Invested Principal</p>
                  <p className="text-xl font-bold text-slate-700">₹{results.invested.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-4 bg-blue-50/50 rounded-2xl">
                  <p className="text-[10px] font-bold text-blue-400 uppercase">Gross Net Worth</p>
                  <p className="text-xl font-bold text-blue-900">₹{results.preTaxNetWorth.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex justify-between items-center px-2 text-red-500">
                  <span className="text-xs font-bold uppercase">LTCG Tax</span>
                  <span className="font-black">- ₹{results.tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl text-white text-center">
                  <p className="text-xs font-bold opacity-60 uppercase mb-1">Post-Tax Corpus</p>
                  <p className="text-3xl font-black">₹{results.postTaxWealth.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: SWP Sustainability */}
          <div className="lg:col-span-4">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl text-white shadow-xl h-full flex flex-col">
              <div className="flex items-center gap-2 mb-8">
                <Clock className="text-indigo-200" />
                <h2 className="text-xl font-bold">SWP Sustainability</h2>
              </div>
              
              <div className="flex-1 space-y-10">
                <div className="text-center">
                  <p className="text-indigo-100 text-xs uppercase font-bold tracking-widest mb-2">Your fund will last</p>
                  {results.isPerpetual ? (
                    <p className="text-5xl font-black">Forever ∞</p>
                  ) : (
                    <p className="text-5xl font-black">{results.swpYears} <span className="text-xl">Years</span></p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <p className="text-[10px] uppercase font-bold opacity-70 mb-1">Monthly Payout</p>
                    <p className="text-xl font-bold">₹{monthlyWithdrawal.toLocaleString('en-IN')}</p>
                  </div>
                  
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <p className="text-[10px] uppercase font-bold opacity-70 mb-1">Status at Age {age + tenure + parseFloat(results.swpYears)}</p>
                    <p className="text-sm font-medium">
                      {results.isPerpetual 
                        ? "Your withdrawal rate is lower than your growth rate. Wealth will grow indefinitely."
                        : `Your corpus will be fully utilized. Consider reducing withdrawal to ₹${Math.round(results.postTaxWealth * 0.005).toLocaleString('en-IN')} for perpetuity.`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-[10px] opacity-60 italic leading-relaxed">
                *SWP phase assumes a conservative 8% post-retirement yield.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
