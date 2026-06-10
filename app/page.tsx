'use client';

import React, { useState } from 'react';
import { Loader2, AlertCircle, CheckCircle2, Clipboard } from 'lucide-react';

const DEMO_TEXT = `Meeting: Q3 Product Launch Sync
Date: October 12, 2026
Attendees: Sarah (PM), Mike (Eng), Lisa (Design), David (Marketing)

Notes:
Sarah kicked off the meeting by confirming that the target launch date for the new dashboard is set for Nov 15th. 
Mike raised a concern about the new real-time charting library. It's causing memory leaks in Safari. 
Decision made: We will temporarily disable the real-time updates on Safari and fallback to polling every 30s until the library authors release a patch. 
Lisa showed the finalized high-fidelity mockups. They look great and are approved for development. 
David needs the final asset package from Lisa by next week to start the ad campaigns. 
Mike mentioned he's blocked on the backend API deployment because the DevOps team hasn't provisioned the production database yet. This is a major risk.

Action Items:
- Lisa to send final design assets to David. (Due: Oct 19, Priority: High)
- Mike to implement Safari polling fallback. (Due: Oct 20, Priority: Medium)
- Sarah to escalate database provisioning with DevOps. (Due: Oct 13, Priority: High)
- David to draft initial ad copy. (Due: Oct 25, Priority: Low)
`;

interface Task {
  title: string;
  owner: string;
  priority: 'high' | 'medium' | 'low';
  due: string;
}

interface AnalysisResult {
  summary: string;
  decisions: string[];
  tasks: Task[];
  blockers: string[];
}

export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze text');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyTasks = () => {
    if (!result?.tasks) return;
    const taskText = result.tasks.map(t => 
      `[${t.priority.toUpperCase()}] ${t.title} - Owner: ${t.owner}, Due: ${t.due}`
    ).join('\n');
    
    navigator.clipboard.writeText(taskText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-2">
            Powered by Azure OpenAI
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">FocusFlow AI</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Paste meeting notes or emails — get a summary and prioritized tasks instantly.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Raw Notes
            </label>
            <button
              onClick={() => setText(DEMO_TEXT)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Load demo
            </button>
          </div>
          
          <textarea
            id="notes"
            rows={8}
            className="block w-full rounded-lg border-gray-300 border p-4 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors"
            placeholder="Paste your meeting notes or email thread here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-gray-500">
              {text.length} characters
            </span>
            <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Analyzing...
                </>
              ) : (
                'Analyze →'
              )}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Analysis Failed</h3>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-3">Summary</h2>
              <p className="text-gray-800 leading-relaxed text-lg">
                {result.summary}
              </p>
            </div>

            {/* Action Items Card */}
            {result.tasks && result.tasks.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-xs font-bold tracking-wider text-gray-500 uppercase">Action Items</h2>
                  <button
                    onClick={copyTasks}
                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-md shadow-sm transition-colors"
                  >
                    {copied ? (
                      <><CheckCircle2 className="h-4 w-4 mr-1.5 text-green-500" /> Copied!</>
                    ) : (
                      <><Clipboard className="h-4 w-4 mr-1.5" /> Copy all</>
                    )}
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {result.tasks.map((task, i) => (
                    <div key={i} className="p-5 hover:bg-gray-50 transition-colors flex items-start gap-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-1">{task.title}</p>
                        <div className="flex items-center text-sm text-gray-500 gap-4">
                          <span className="flex items-center gap-1">
                            <span className="font-medium text-gray-700">Owner:</span> {task.owner}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="font-medium text-gray-700">Due:</span> {task.due}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Decisions and Blockers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Decisions Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-4">Key Decisions</h2>
                {result.decisions && result.decisions.length > 0 ? (
                  <ul className="space-y-3">
                    {result.decisions.map((decision, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                        <span>{decision}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No key decisions recorded.</p>
                )}
              </div>

              {/* Blockers Card */}
              <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
                <h2 className="text-xs font-bold tracking-wider text-red-500 uppercase mb-4">Blockers & Risks</h2>
                {result.blockers && result.blockers.length > 0 ? (
                  <ul className="space-y-3">
                    {result.blockers.map((blocker, i) => (
                      <li key={i} className="flex items-start text-sm text-red-700">
                        <span className="mr-2 flex-shrink-0">⚠</span>
                        <span>{blocker}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No blockers identified.</p>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}
