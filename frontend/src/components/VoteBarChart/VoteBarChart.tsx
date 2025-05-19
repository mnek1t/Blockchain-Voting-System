import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { ElectionCandidatesResults } from "../../types";
import { useTranslation } from "react-i18next";
interface VotingBarChartProps {
    results: ElectionCandidatesResults[]
}
const VotingBarChart = ({results}: VotingBarChartProps) => {
    const { t } = useTranslation();
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    let delayed = false;
    const transformResultsToChartData = (results : ElectionCandidatesResults[]) => ({
        labels: results.map(c => c.name), // x-axis labels
        datasets: [{
          label: t("votesReceived"),
          data: results.map(c => c.voteCount),
          backgroundColor: results.map(() => '#2f4984'), //#012169
          borderColor: results.map(() => '#2f4984'),
          borderWidth: 1
        }]
    });

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext("2d");
        if (!ctx) return;

        const chart = new Chart(ctx,  {
            type: 'bar',
            data: transformResultsToChartData(results),
            options: {
              responsive: true,
              animation: {
                onComplete: () => { delayed = true; },
                delay: (context) => {
                  let delay = 0;
                  if (context.type === 'data' && context.mode === 'default' && !delayed) {
                    delay = context.dataIndex * 300 + context.datasetIndex * 100;
                  }
                  return delay;
                }
              },
              plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: t("candidates")
                  }
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: t("voteCount")
                  }
                }
              }
            }
          });
        return () => chart.destroy();
    }, [results]);

    return <canvas ref={chartRef} />;
};

export default VotingBarChart;