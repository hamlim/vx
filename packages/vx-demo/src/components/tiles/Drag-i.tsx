import React, { useMemo, useState, useEffect } from 'react';
import { scaleOrdinal } from '@vx/scale';
import { LinearGradient } from '@vx/gradient';
import { Drag, raise } from '@vx/drag';
import { WidthAndHeight, ShowProvidedProps } from '../../types';

const colors = [
  '#025aac',
  '#02cff9',
  '#02efff',
  '#03aeed',
  '#0384d7',
  '#edfdff',
  '#ab31ff',
  '#5924d7',
  '#d145ff',
  '#1a02b1',
  '#e582ff',
  '#ff00d4',
  '#270eff',
  '#827ce2',
];

interface Circle {
  id: string;
  radius: number;
  x: number;
  y: number;
}

const generateCircles = ({ num, width, height }: { num: number } & WidthAndHeight) =>
  new Array(num).fill(1).map((d, i) => {
    const radius = 25 - Math.random() * 20;
    return {
      id: `${i}`,
      radius,
      x: Math.round(Math.random() * (width - radius * 2) + radius),
      y: Math.round(Math.random() * (height - radius * 2) + radius),
    };
  });

const generateItems = ({ width, height }: WidthAndHeight) =>
  generateCircles({
    num: width < 360 ? 40 : 185,
    width,
    height,
  });

export default function DragI({ width, height }: ShowProvidedProps) {
  const [draggingItems, setDraggingItems] = useState<Circle[]>([]);

  useEffect(() => {
    if (width > 10 && height > 10) setDraggingItems(generateItems({ width, height }));
  }, [width, height]);

  const colorScale = useMemo(
    () =>
      scaleOrdinal({
        range: colors,
        domain: draggingItems.map(d => d.id),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, height],
  );

  if (draggingItems.length === 0 || width < 10) return null;

  return (
    <div className="Drag" style={{ touchAction: 'none' }}>
      <svg width={width} height={height}>
        <LinearGradient id="stroke" from="#ff00a5" to="#ffc500" />
        <rect fill="#c4c3cb" width={width} height={height} rx={14} />

        {draggingItems.map((d, i) => (
          <Drag
            key={`${d.id}`}
            width={width}
            height={height}
            onDragStart={() => {
              // svg follows the painter model
              // so we need to move the data item
              // to end of the array for it to be drawn
              // "on top of" the other data items
              setDraggingItems(raise(draggingItems, i));
            }}
          >
            {({ dragStart, dragEnd, dragMove, isDragging, dx, dy }) =>
              (false && isDragging && console.log(d.id, d.x, dx)) || (
                <circle
                  key={`dot-${d.id}`}
                  cx={d.x}
                  cy={d.y}
                  r={isDragging ? d.radius + 4 : d.radius}
                  fill={isDragging ? 'url(#stroke)' : colorScale(d.id)}
                  transform={`translate(${dx}, ${dy})`}
                  fillOpacity={0.9}
                  stroke={isDragging ? 'white' : 'transparent'}
                  strokeWidth={2}
                  onMouseMove={dragMove}
                  onMouseUp={dragEnd}
                  onMouseDown={dragStart}
                  onTouchStart={dragStart}
                  onTouchMove={dragMove}
                  onTouchEnd={dragEnd}
                />
              )
            }
          </Drag>
        ))}
      </svg>
      <div className="deets">
        <div>
          Based on Mike Bostock's{' '}
          <a href="https://bl.ocks.org/mbostock/c206c20294258c18832ff80d8fd395c3">
            Circle Dragging II
          </a>
        </div>
      </div>

      <style jsx>{`
        .Drag {
          display: flex;
          flex-direction: column;
          user-select: none;
        }

        svg {
          margin: 1rem 0;
        }
        .deets {
          display: flex;
          flex-direction: row;
          font-size: 12px;
        }
        .deets > div {
          margin: 0.25rem;
        }
      `}</style>
    </div>
  );
}
