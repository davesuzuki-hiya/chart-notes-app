import React, { forwardRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Customized,
  Label,
} from 'recharts';

function CustomTooltip({ active, payload, theme }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={`custom-tooltip ${theme === 'dark' ? 'dark' : ''}`}>
        <p><strong>{data.month}</strong></p>
        <p>Value: {data.value}</p>
        {data.note && <p><strong>Note:</strong> {data.note}</p>}
      </div>
    );
  }
  return null;
}

function NoteBubbles({ data, xAxisMap, yAxisMap, bubbleColor, width }) {
  if (!xAxisMap || !yAxisMap) return null;

  const xAxis = Object.values(xAxisMap)[0];
  const yAxis = Object.values(yAxisMap)[0];

  if (!xAxis || !yAxis) return null;

  const chartWidth = width || 800;

  return (
    <g>
      {data.map((point, index) => {
        if (!point.note) return null;

        const cx = xAxis.scale(point.month) + (xAxis.bandwidth ? xAxis.bandwidth() / 2 : 0);
        const cy = yAxis.scale(point.value);

        if (isNaN(cx) || isNaN(cy)) return null;

        const bubbleWidth = Math.min(Math.max(point.note.length * 7, 60), 220);
        const bubbleHeight = 28;
        const pointerSize = 6;

        // Adjust bubble position to prevent clipping at edges
        let bubbleX = cx - bubbleWidth / 2;
        let pointerOffset = 0;

        // Check left edge
        if (bubbleX < 10) {
          pointerOffset = bubbleX - 10;
          bubbleX = 10;
        }
        // Check right edge
        if (bubbleX + bubbleWidth > chartWidth - 10) {
          pointerOffset = (bubbleX + bubbleWidth) - (chartWidth - 10);
          bubbleX = chartWidth - bubbleWidth - 10;
        }

        const bubbleY = cy - bubbleHeight - 18;
        const pointerX = cx;

        return (
          <g key={point.id || index}>
            <rect
              x={bubbleX}
              y={bubbleY}
              width={bubbleWidth}
              height={bubbleHeight}
              rx={6}
              ry={6}
              fill={bubbleColor}
            />
            <polygon
              points={`${pointerX - pointerSize},${bubbleY + bubbleHeight} ${pointerX + pointerSize},${bubbleY + bubbleHeight} ${pointerX},${bubbleY + bubbleHeight + pointerSize + 2}`}
              fill={bubbleColor}
            />
            <text
              x={bubbleX + bubbleWidth / 2}
              y={bubbleY + bubbleHeight / 2 + 4}
              textAnchor="middle"
              fill="white"
              fontSize={11}
              fontWeight="500"
            >
              {point.note.length > 30 ? point.note.substring(0, 28) + '...' : point.note}
            </text>
          </g>
        );
      })}
    </g>
  );
}

const Chart = forwardRef(function Chart({ data, showNotes, onPointClick, settings }, ref) {
  const lineType = settings.lineStyle === 'straight' ? 'linear' : 'monotone';
  const isDark = settings.theme === 'dark';

  const axisStyle = isDark ? { fill: '#e0e0e0' } : { fill: '#666' };
  const gridColor = isDark ? '#444' : '#e0e0e0';

  // Extra margins when notes are shown to prevent clipping
  const notesMargin = showNotes ? 80 : 30;

  return (
    <div ref={ref} className={`chart-export-area ${isDark ? 'dark' : ''}`}>
      {settings.title && <h2 className="chart-title">{settings.title}</h2>}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{
            top: showNotes ? 60 : 20,
            right: notesMargin,
            left: settings.yAxisTitle ? 60 : 20,
            bottom: settings.xAxisTitle ? 50 : 20
          }}
          onClick={(e) => {
            if (e && e.activePayload) {
              onPointClick(e.activePayload[0].payload);
            }
          }}
        >
          {settings.showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          )}
          <XAxis dataKey="month" tick={axisStyle} axisLine={{ stroke: gridColor }}>
            {settings.xAxisTitle && (
              <Label value={settings.xAxisTitle} offset={-10} position="insideBottom" style={axisStyle} />
            )}
          </XAxis>
          <YAxis tick={axisStyle} axisLine={{ stroke: gridColor }}>
            {settings.yAxisTitle && (
              <Label value={settings.yAxisTitle} angle={-90} position="insideLeft" style={{ textAnchor: 'middle', ...axisStyle }} />
            )}
          </YAxis>
          <Tooltip content={<CustomTooltip theme={settings.theme} />} />
          <Line
            type={lineType}
            dataKey="value"
            stroke={settings.lineColor}
            strokeWidth={2}
            dot={{ r: 6, fill: settings.dotColor, cursor: 'pointer' }}
            activeDot={{ r: 8, fill: settings.dotColor }}
          />
          {showNotes && (
            <Customized
              component={(props) => <NoteBubbles {...props} data={data} bubbleColor={settings.bubbleColor} />}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default Chart;
