import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const CARD_H = 0.38;
const CARD_MAX_W = 0.34;
const CARD_RATIO = 1.45;
const STEP = 40;
const DRUM = 2.22;
const LENS = 2.7;
const RING_R = 1.14;
const BOW = 1.82;
const TITLE = 0.124;
const INDEX = 0.04;
const CULL = 1.6;
const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
const SETTLE = 140;
const EASE = 0.12;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (start, end, amount) => start + (end - start) * amount;
const radians = (degrees) => (degrees * Math.PI) / 180;
const bowAt = (drumDegrees, bow) =>
  -bow * (1 - Math.cos(radians(drumDegrees)));

function place(ringDegrees, drumDegrees, ringRadius, drumRadius, bow, progress) {
  return (
    `translateX(${progress * bowAt(drumDegrees, bow)}px)` +
    ` rotateZ(${(1 - progress) * ringDegrees}deg) translateY(${-(1 - progress) * ringRadius}px)` +
    ` rotateX(${progress * drumDegrees}deg) translateZ(${progress * drumRadius}px)`
  );
}

export default function WorksWheel({ items, label = 'Capabilities', className = '' }) {
  const stageRef = useRef(null);
  const wheelRef = useRef(null);
  const cardRefs = useRef([]);
  const labelRef = useRef(null);
  const titleRef = useRef(null);
  const turn = useRef(0);
  const target = useRef(0);
  const drag = useRef(null);
  const settling = useRef(0);
  const [active, setActive] = useState(0);
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  const count = items.length;
  const last = Math.max(count - 1, 0);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const element = stageRef.current;
    if (!element) return undefined;

    const readSize = () => setStage({ w: element.clientWidth, h: element.clientHeight });
    readSize();
    const observer = new ResizeObserver(readSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const metrics = useMemo(() => {
    const { w, h } = stage;
    const maxWidth = w < 640 ? 0.84 : CARD_MAX_W;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * maxWidth);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1;

    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: cardH * TITLE,
      index: cardH * INDEX,
    };
  }, [stage, count]);

  useEffect(() => {
    if (!stage.h) return undefined;

    let frame = 0;
    const { ringR, ringScale, drumR, bow } = metrics;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current;
      else turn.current += gap * (reducedMotion ? 1 : EASE);

      const position = turn.current;
      const progress = clamp(position, 0, 1);
      const itemOffset = Math.max(0, position - 1);

      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-progress * drumR}px)`;
      }

      for (let i = 0; i < count; i += 1) {
        const distance = i - itemOffset;
        const drumDegrees = distance * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(
            distance * (360 / count),
            drumDegrees,
            ringR,
            drumR,
            bow,
            progress,
          );
          card.style.opacity =
            progress > 0.5 && Math.abs(distance) > CULL ? '0' : '1';
          card.style.zIndex = String(Math.round(100 - Math.abs(distance) * 2));
        }

        const face = card?.firstElementChild;
        if (face) {
          face.style.transform = `scale(${lerp(ringScale, 1, progress)})`;
        }
      }

      if (labelRef.current) labelRef.current.style.opacity = String(1 - progress);
      if (titleRef.current) titleRef.current.style.opacity = String(progress);

      const nearest = clamp(Math.round(itemOffset), 0, last);
      setActive((previous) => (previous === nearest ? previous : nearest));
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [metrics, stage.h, count, last, reducedMotion]);

  const goTo = useCallback(
    (next) => {
      target.current = clamp(next, 0, last + 1);
    },
    [last],
  );

  useEffect(() => {
    const element = stageRef.current;
    if (!element) return undefined;

    const onWheel = (event) => {
      const next = target.current + event.deltaY / WHEEL_UNITS;
      if (next > 0 && next < last + 1) event.preventDefault();
      goTo(next);

      window.clearTimeout(settling.current);
      settling.current = window.setTimeout(
        () => goTo(Math.round(target.current)),
        SETTLE,
      );
    };

    element.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      element.removeEventListener('wheel', onWheel);
      window.clearTimeout(settling.current);
    };
  }, [goTo, last]);

  return (
    <section
      aria-label={label}
      className={`works-wheel ${className}`.trim()}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`works-wheel-${active}`}
        className="works-wheel__stage"
        style={{ perspective: `${metrics.depth}px` }}
        onPointerDown={(event) => {
          drag.current = event.clientY;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (drag.current === null) return;
          goTo(target.current + (drag.current - event.clientY) / DRAG_UNITS);
          drag.current = event.clientY;
        }}
        onPointerUp={() => {
          drag.current = null;
          if (target.current > 1) goTo(Math.round(target.current));
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') goTo(Math.round(target.current) + 1);
          else if (event.key === 'ArrowUp') goTo(Math.round(target.current) - 1);
          else return;
          event.preventDefault();
        }}
      >
        <div ref={wheelRef} className="works-wheel__drum">
          {items.map((item, index) => {
            return (
              <div
                key={item.title}
                id={`works-wheel-${index}`}
                role="option"
                aria-selected={index === active}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className="works-wheel__card"
                style={{
                  width: metrics.cardW,
                  height: metrics.cardH,
                  marginLeft: -metrics.cardW / 2,
                  marginTop: -metrics.cardH / 2,
                }}
              >
                <article className="capability-wheel-card">
                  <div className="capability-wheel-card__content">
                    <div className={`capability-wheel-card__icon bg-gradient-to-br ${item.gradient}`}>
                      <i className={`lni lni-${item.icon}`} aria-hidden="true" />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                  <div className={`capability-wheel-card__accent bg-gradient-to-r ${item.gradient}`} />
                </article>
              </div>
            );
          })}
        </div>
      </div>

      <div
        ref={labelRef}
        className="works-wheel__label"
        style={{ fontSize: metrics.title }}
      >
        {label}
      </div>
      <div
        ref={titleRef}
        className="works-wheel__active-title"
        style={{ fontSize: metrics.title }}
      >
        {items[active]?.title}
      </div>

      <ol className="works-wheel__index" style={{ fontSize: metrics.index }}>
        {items.map((item, index) => (
          <li key={item.title}>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-current={index === active ? 'true' : undefined}
              className={index === active ? 'is-active' : ''}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
