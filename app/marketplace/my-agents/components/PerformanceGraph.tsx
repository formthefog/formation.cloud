import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Chart } from 'chart.js/auto';

interface PerformanceGraphProps {
  timeRange: string;
}

export function PerformanceGraph({ timeRange }: PerformanceGraphProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Mock data - would come from API
  const getData = () => {
    const now = new Date();
    const data = [];
    const labels = [];
    
    const points = timeRange === '24h' ? 24 : 
                  timeRange === '7d' ? 7 : 
                  timeRange === '30d' ? 30 : 90;

    for (let i = points - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setHours(date.getHours() - i);
      
      labels.push(timeRange === '24h' 
        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString([], { month: 'short', day: 'numeric' })
      );

      data.push({
        requests: Math.floor(Math.random() * 1000) + 500,
        responseTime: Math.floor(Math.random() * 100) + 150,
        successRate: Math.floor(Math.random() * 10) + 90,
      });
    }

    return { labels, data };
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const { labels, data } = getData();

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Requests',
            data: data.map(d => d.requests),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Response Time (ms)',
            data: data.map(d => d.responseTime),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Success Rate (%)',
            data: data.map(d => d.successRate),
            borderColor: 'rgb(168, 85, 247)',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(156, 163, 175, 0.1)',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [timeRange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[400px]"
    >
      <canvas ref={chartRef} />
    </motion.div>
  );
} 