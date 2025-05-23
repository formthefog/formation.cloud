'use client';

import { useState, useEffect } from 'react';
import { FaRobot, FaCode, FaBrain, FaChartLine, FaPlay, FaPause, FaRotateRight } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

type DemoStep = {
  input: string;
  output: string;
  type: 'user' | 'agent' | 'code';
  language?: string;
};

type AgentDemo = {
  id: string;
  name: string;
  icon: JSX.Element;
  color: string;
  description: string;
  demo: DemoStep[];
};

const demos: AgentDemo[] = [
  {
    id: 'code-assistant',
    name: 'Code Assistant API',
    icon: <FaCode />,
    color: 'from-blue-500 to-indigo-600',
    description: 'See how to integrate our code assistant API into your development workflow.',
    demo: [
      {
        type: 'code',
        language: 'javascript',
        input: '// Initialize the Formation client',
        output: `import { Formation } from '@formation.cloud/sdk';

const formation = new Formation({
  apiKey: process.env.FORMATION_API_KEY
});

// Create an agent instance
const codeAssistant = formation.agent('code-assistant');`
      },
      {
        type: 'code',
        language: 'javascript',
        input: '// Send a code optimization request',
        output: `const response = await codeAssistant.optimize({
  code: \`function fibonacci(n) {
    let result = [];
    for(let i = 0; i < n; i++) {
      if(i <= 1) result.push(i);
      else result.push(result[i-1] + result[i-2]);
    }
    return result;
  }\`,
  options: {
    optimize: ['performance', 'memory'],
    language: 'javascript'
  }
});`
      },
      {
        type: 'agent',
        input: 'API Response:',
        output: `{
  "status": "success",
  "optimizedCode": "const fibonacci = (n, memo = new Map([[0, 0], [1, 1]])) => {
    const result = [];
    for(let i = 0; i < n; i++) {
      if(!memo.has(i)) {
        memo.set(i, memo.get(i-1) + memo.get(i-2));
      }
      result.push(memo.get(i));
    }
    return result;
  }",
  "improvements": [
    "Added memoization for O(n) time complexity",
    "Reduced memory allocations",
    "Improved cache efficiency"
  ],
  "credits": 5
}`
      }
    ]
  },
  {
    id: 'research',
    name: 'Research API',
    icon: <FaBrain />,
    color: 'from-purple-500 to-pink-600',
    description: 'Integrate AI-powered research capabilities into your applications.',
    demo: [
      {
        type: 'code',
        language: 'python',
        input: '# Set up the Formation Research API',
        output: `from formation import Formation

formation = Formation(api_key="YOUR_API_KEY")
research_agent = formation.agent("research-assistant")

# Configure research parameters
params = {
    "query": "latest developments in AI safety",
    "sources": ["arxiv", "academic_journals"],
    "time_range": "last_6_months"
}`
      },
      {
        type: 'code',
        language: 'python',
        input: '# Execute research analysis',
        output: `# Stream results in real-time
async for result in research_agent.analyze(params):
    if result.type == "finding":
        print(f"📊 New finding: {result.content}")
    elif result.type == "recommendation":
        print(f"💡 Recommendation: {result.content}")`
      },
      {
        type: 'agent',
        input: 'API Response Stream:',
        output: `{
  "type": "finding",
  "content": "Constitutional AI approaches show promise",
  "confidence": 0.92,
  "sources": ["arxiv:2308.12345", "nature.com/ai/789"]
}
{
  "type": "finding",
  "content": "Reward modeling remains challenging",
  "confidence": 0.88,
  "sources": ["arxiv:2309.67890"]
}
{
  "type": "recommendation",
  "content": "Focus on robust oversight mechanisms",
  "priority": "high",
  "implementation_difficulty": "medium"
}`
      }
    ]
  },
  {
    id: 'market',
    name: 'Market Analysis API',
    icon: <FaChartLine />,
    color: 'from-green-500 to-emerald-600',
    description: 'Real-time market analysis through simple API calls.',
    demo: [
      {
        type: 'code',
        language: 'typescript',
        input: '// Configure market analysis agent',
        output: `import { Formation, MarketAnalysisParams } from '@formation.cloud/sdk';

const formation = new Formation({
  apiKey: process.env.FORMATION_API_KEY,
  region: 'us-west-1'
});

const marketAgent = formation.agent('market-analyst');`
      },
      {
        type: 'code',
        language: 'typescript',
        input: '// Request real-time market analysis',
        output: `const params: MarketAnalysisParams = {
  sector: 'technology',
  metrics: ['growth', 'sentiment', 'investment_trends'],
  timeframe: 'last_30_days',
  dataPoints: ['market_cap', 'volume', 'social_sentiment']
};

// Subscribe to real-time updates
const subscription = marketAgent.analyze(params)
  .subscribe({
    onData: (insight) => console.log('New insight:', insight),
    onError: (error) => console.error('Error:', error),
    onComplete: () => console.log('Analysis complete')
  });`
      },
      {
        type: 'agent',
        input: 'Real-time API Updates:',
        output: `{
  "timestamp": "2024-02-20T15:30:00Z",
  "sector": "technology",
  "insights": [
    {
      "trend": "AI/ML sector growth",
      "confidence": 0.95,
      "metrics": {
        "growth_rate": "+28.5%",
        "momentum": "strong"
      }
    },
    {
      "trend": "Cloud services demand",
      "confidence": 0.92,
      "metrics": {
        "growth_rate": "+15.3%",
        "momentum": "increasing"
      }
    }
  ],
  "credits_used": 10
}`
      }
    ]
  }
];

const TypewriterText = ({ text, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return <span className="font-mono">{displayText}</span>;
};

const AgentPlayground = () => {
  const [selectedDemo, setSelectedDemo] = useState<AgentDemo>(demos[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setShowOutput(false);
  };

  const playNextStep = () => {
    if (currentStepIndex < selectedDemo.demo.length - 1) {
      setShowOutput(false);
      setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
        setShowOutput(true);
      }, 500);
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    let timeout;
    if (isPlaying && currentStepIndex < selectedDemo.demo.length) {
      setShowOutput(true);
      timeout = setTimeout(playNextStep, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, currentStepIndex, selectedDemo.demo.length]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
      {/* Agent Selector */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        {demos.map(demo => (
          <button
            key={demo.id}
            onClick={() => {
              setSelectedDemo(demo);
              resetDemo();
            }}
            className={`p-4 rounded-xl text-left transition-all ${
              selectedDemo.id === demo.id
                ? 'bg-gray-100 shadow-md'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`text-2xl bg-gradient-to-r ${demo.color} p-2 rounded-lg text-white`}>
                {demo.icon}
              </div>
              <div>
                <h3 className="text-gray-900 font-medium">{demo.name}</h3>
                <p className="text-sm text-gray-500">{demo.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Demo Playground */}
      <div className="lg:col-span-3">
        <div className="bg-gray-900 rounded-xl p-6 h-[500px] flex flex-col">
          {/* Terminal Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white/80 hover:text-white transition-colors"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button
                onClick={resetDemo}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FaRotateRight />
              </button>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="flex-1 overflow-auto font-mono text-sm">
            <AnimatePresence mode="wait">
              {selectedDemo.demo.slice(0, currentStepIndex + 1).map((step, index) => (
                <motion.div
                  key={`${selectedDemo.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6"
                >
                  <div className={`flex items-start gap-3 ${
                    step.type === 'agent' 
                      ? 'text-green-400' 
                      : step.type === 'code'
                      ? 'text-blue-300'
                      : 'text-blue-400'
                  }`}>
                    <span className="mt-1">
                      {step.type === 'agent' ? <FaRobot /> : '>'}
                    </span>
                    <div className="flex-1">
                      <TypewriterText 
                        text={step.input} 
                        onComplete={() => setShowOutput(true)}
                      />
                      {showOutput && index === currentStepIndex && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-white/90 whitespace-pre-wrap"
                        >
                          {step.output}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPlayground; 