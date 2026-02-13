import React, { useState, useMemo, useRef } from 'react';
import { 
  Calculator, TrendingUp, PieChart, MessageSquare, 
  ArrowUpRight, ShieldCheck, Info, Target, Landmark, FileText, Download 
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const App = () => {
  const reportRef = useRef();
  const [monthlyInvest, setMonthlyInvest] = useState(10000);
  const [tenure, setTenure] = useState(20);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [stepUp, setStepUp] = useState(10);
  const [age, setAge] = useState(30);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Consultant here. Your plan is ready for a professional review. You can now download this as a PDF report for your records." }
  ]);

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
      currentSIP *= (1 + stepUp / 100);
    }

    const gains = maturityValue - totalInvested;
    const tax = Math.max(0, gains - 125000) * 0.125;

    return {
      invested: Math.round(totalInvested),
      maturity: Math.round(maturityValue),
      gains: Math.round(gains),
      tax: Math.round(tax),
      net: Math.round(maturityValue - tax)
    };
  }, [monthlyInvest, tenure, expectedReturn, stepUp]);

  const downloadPDF = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Wealth_Plan_Age${age}.pdf`);
  };

  const handleChat = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: "I've analyzed that. Based on 2026 LTCG rules, your strategy remains tax-efficient. Ensure you check the 'Asset Allocation' section in your downloaded report." }]);
    }, 600);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <Landmark size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">FinConsult 2026</h1>
              <p className="text-slate-500 text-sm font-medium">Official Financial Planning Terminal</p>
            </div>
          </div>
          <button 
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            <Download size={18} /> Download Wealth Report
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Calculator size={20} className="text-blue-600" /> Plan Parameters
              </h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-600">Monthly SIP</label>
                    <span className="text-blue-600 font-bold">₹{monthlyInvest.toLocaleString('en-IN')}</span>
                  </div>
                  <input type="range" min="1000" max="100000" step="1000" value={monthlyInvest} 
                    onChange={(e) => setMonthlyInvest(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-600 flex items-center gap-1">Annual Step-Up %</label>
                    <span className="text-emerald-600 font-bold">{stepUp}%</span>
                  </div>
                  <input type="range" min="0" max="25" step="1" value={stepUp} 
                    onChange={(e) => setStepUp(Number(e.target.value))} className="w-full accent-emerald-500" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm font-bold">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block mb-1">Duration</span>
                        <input type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="bg-transparent outline-none w-full text-lg" />
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block mb-1">Your Age</span>
                        <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="bg-transparent outline-none w-full text-lg" />
                    </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <PieChart size={16} className="text-blue-500" /> Suggested Diversification
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold">
                    <span>Equity Funds</span>
                    <span>{100-age}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{width: `${100-age}%`}}></div>
                </div>
                <div className="flex justify-between text-xs font-bold">
                    <span>Debt & Gold</span>
                    <span>{age}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{width: `${age}%`}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Capture Area */}
          <div className="lg:col-span-4" ref={reportRef}>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <Target size={20} className="text-emerald-600" /> Wealth Snapshot
                </h2>
                <FileText size={20} className="text-slate-300" />
              </div>
              
              <div className="space-y-6 flex-1">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Principal Invested</p>
                    <p className="text-2xl font-black text-slate-800">₹{results.invested.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Estimated Capital Gains</p>
                    <p className="text-2xl font-black text-emerald-700">₹{results.gains.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="pt-6 mt-2 border-t border-dashed border-slate-200">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={80}/></div>
                    <p className="text-xs font-bold opacity-70 uppercase tracking-widest mb-2 text-center">Net Worth Post-Tax (2026)</p>
                    <p className="text-4xl font-black text-center mb-2">₹{(results.net/10000000).toFixed(2)} Cr</p>
                    <div className="flex justify-center items-center gap-2 text-[10px] opacity-60">
                        <ShieldCheck size={12}/> Tax Calculated at 12.5% LTCG
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Chat Interface */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
              <div className="p-5 border-b bg-slate-50 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <h3 className="font-bold text-sm text-slate-700">Wealth AI Assistant</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleChat} className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-2">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your strategy..." className="flex-1 p-3 bg-slate-50 rounded-xl outline-none text-sm" />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all">Ask</button>
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
