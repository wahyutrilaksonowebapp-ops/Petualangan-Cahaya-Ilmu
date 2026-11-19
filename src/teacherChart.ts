import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import type { WorldProgressSlice } from './multiplayerClient.ts';

let chartRoot: Root | null = null;
let mountedContainer: HTMLElement | null = null;

interface ProgressPieProps {
  data: WorldProgressSlice[];
}

function StudentProgressPieChart({ data }: ProgressPieProps) {
  const hasRealData = data.some((d) => d.value > 0);
  const displayData = hasRealData
    ? data.filter((d) => d.value > 0)
    : data.map((d) => ({ ...d, value: 1 }));

  const pieChartEl = React.createElement(
    PieChart,
    null,
    React.createElement(
      Pie,
      {
        data: displayData,
        dataKey: 'value',
        nameKey: 'name',
        cx: '50%',
        cy: '46%',
        innerRadius: 48,
        outerRadius: 82,
        paddingAngle: 3,
        stroke: '#0f172a',
        strokeWidth: 2,
      },
      displayData.map((entry) =>
        React.createElement(Cell, {
          key: `cell-${entry.stageId}`,
          fill: hasRealData ? entry.color : `${entry.color}55`,
        })
      )
    ),
    React.createElement(Tooltip, {
      contentStyle: {
        backgroundColor: '#0f172a',
        borderColor: '#f59e0b',
        borderRadius: '12px',
        color: '#f8fafc',
        fontSize: '12px',
      },
      itemStyle: { color: '#fde047', fontWeight: 700 },
      formatter: (val: unknown, _name: unknown, props: { payload?: WorldProgressSlice }) => {
        if (!hasRealData) return ['Belum ada progres', 'Status'];
        const p = props?.payload;
        return [
          `${val} murid tuntas • Rata-rata ${p?.avgScore ?? 0}%`,
          p?.shortName || 'Dunia',
        ];
      },
    }),
    React.createElement(Legend, {
      verticalAlign: 'bottom',
      height: 44,
      wrapperStyle: { fontSize: '11px', color: '#cbd5e1' },
    })
  );

  return React.createElement(
    'div',
    { style: { width: '100%', height: '250px' } },
    React.createElement(ResponsiveContainer, {
      width: '100%',
      height: '100%',
      children: pieChartEl,
    })
  );
}

/**
 * Mounts or updates the Recharts Pie Chart inside the Teacher Mode modal.
 */
export function renderTeacherProgressPieChart(
  container: HTMLElement | null,
  data: WorldProgressSlice[]
) {
  if (!container) return;
  if (mountedContainer !== container) {
    if (chartRoot) {
      chartRoot.unmount();
    }
    chartRoot = createRoot(container);
    mountedContainer = container;
  }
  chartRoot?.render(React.createElement(StudentProgressPieChart, { data }));
}
