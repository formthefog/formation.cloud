'use client';

import { useRouter } from 'next/navigation';
import { FaRobot, FaArrowRight, FaStar, FaCode, FaBrain, FaChartLine } from 'react-icons/fa6';

const AgentCard = ({ agent }) => {
  const router = useRouter();

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden cursor-pointer group"
      onClick={() => router.push('#marketplace')}
    >
      <div className="relative">
        {/* Agent Preview/Demo Area */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 h-48 flex items-center justify-center">
          <div className="text-4xl text-formation-blue">
            {agent.icon}
          </div>
        </div>
        
        {/* Popular/New Tag */}
        {agent.tag && (
          <div className="absolute top-4 right-4 bg-formation-blue text-white text-xs px-3 py-1 rounded-full">
            {agent.tag}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-formation-blue transition-colors">
            {agent.name}
          </h3>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="text-sm text-gray-600">{agent.rating}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          {agent.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div>
            <span className="font-medium text-formation-blue">{agent.credits}</span> credits/use
          </div>
          <div>{agent.uses.toLocaleString()} uses</div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <img 
              src={agent.developer.avatar} 
              alt={agent.developer.name}
              className="w-6 h-6 rounded-full mr-2"
            />
            by {agent.developer.name}
          </div>
          <div className="text-formation-blue opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            Try it <FaArrowRight size={12} className="ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedAgentsSection = () => {
  const router = useRouter();
  
  const featuredAgents = [
    {
      name: "CodeAssist Pro",
      description: "AI pair programmer that helps you write better code, fix bugs, and improve code quality.",
      icon: <FaCode />,
      rating: 4.9,
      credits: 50,
      uses: 125000,
      tag: "Popular",
      developer: {
        name: "DevTeam AI",
        avatar: "/avatars/devteamai.svg"
      }
    },
    {
      name: "ResearchGPT",
      description: "Advanced research assistant that helps analyze papers, summarize findings, and connect ideas.",
      icon: <FaBrain />,
      rating: 4.8,
      credits: 75,
      uses: 89000,
      tag: "Trending",
      developer: {
        name: "AI Research Labs",
        avatar: "/avatars/airesearchlabs.svg"
      }
    },
    {
      name: "MarketSense AI",
      description: "Real-time market analysis and trading insights powered by advanced ML algorithms.",
      icon: <FaChartLine />,
      rating: 4.9,
      credits: 100,
      uses: 250000,
      tag: "Top Rated",
      developer: {
        name: "QuantAI Systems",
        avatar: "/avatars/quantaisystems.svg"
      }
    },
    {
      name: "AutoML Agent",
      description: "Automated machine learning pipeline creation and optimization for data scientists.",
      icon: <FaRobot />,
      rating: 4.7,
      credits: 80,
      uses: 45000,
      tag: "New",
      developer: {
        name: "ML Forge",
        avatar: "/avatars/mlforge.svg"
      }
    }
  ];

  return (
    <section className="relative bg-gray-50 py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block border border-formation-blue px-4 py-1 text-sm font-medium uppercase tracking-wider text-formation-blue font-geistMono mb-4">
            Featured Agents
          </span>
          <h2 className="text-4xl font-hauora font-[500] tracking-[-0.05em] text-gray-900 mb-4">
            Discover Popular AI Agents
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our curated selection of high-performance AI agents. From coding assistance to market analysis,
            find the perfect agent to enhance your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAgents.map((agent, index) => (
            <AgentCard key={index} agent={agent} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => router.push('#marketplace')}
            className="inline-flex items-center px-6 py-3 bg-formation-blue text-white rounded-lg hover:bg-formation-blue/90 transition-colors"
          >
            Explore All Agents
            <FaArrowRight className="ml-2" size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAgentsSection; 