import React, { useEffect, useState } from 'react';

type Placement = 'top' | 'bottom' | 'right';
type Tip = { text: string; x: number; y: number; placement: Placement };

/**
 * Phenom tooltip: neutrals-400 fill, 8px radius, 4px/8px padding, white small text, 4px from the trigger.
 * Any element with `data-tooltip` shows one on hover or keyboard focus. It is drawn in a single fixed layer
 * above the page so panel clipping and scroll containers never cut it off.
 */
export function TooltipLayer() {
  const [tip, setTip] = useState<Tip | null>(null);

  useEffect(() => {
    let timer = 0;
    const show = (el: HTMLElement, delay: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const r = el.getBoundingClientRect();
        const placement = (el.dataset.tooltipPlacement as Placement) || 'top';
        setTip({
          text: el.dataset.tooltip ?? '',
          x: placement === 'right' ? r.right : r.left + r.width / 2,
          y: placement === 'top' ? r.top : placement === 'bottom' ? r.bottom : r.top + r.height / 2,
          placement,
        });
      }, delay);
    };
    const hide = () => {
      window.clearTimeout(timer);
      setTip(null);
    };
    const target = (e: Event) => (e.target as HTMLElement | null)?.closest?.('[data-tooltip]') as HTMLElement | null;

    const onOver = (e: PointerEvent) => {
      const el = target(e);
      if (el) show(el, 200);
    };
    const onOut = (e: PointerEvent) => {
      const el = target(e);
      if (el && !el.contains(e.relatedTarget as Node)) hide();
    };
    const onFocus = (e: FocusEvent) => {
      const el = target(e);
      if (el && el.matches(':focus-visible')) show(el, 0);
    };

    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);
    document.addEventListener('focusin', onFocus);
    document.addEventListener('focusout', hide);
    document.addEventListener('pointerdown', hide);
    document.addEventListener('scroll', hide, true);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('focusout', hide);
      document.removeEventListener('pointerdown', hide);
      document.removeEventListener('scroll', hide, true);
    };
  }, []);

  if (!tip) return null;

  const transform =
    tip.placement === 'right'
      ? 'translate(4px, -50%)'
      : tip.placement === 'top'
        ? 'translate(-50%, calc(-100% - 4px))'
        : 'translate(-50%, 4px)';

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 'var(--z-tooltip, 600)' as unknown as number }} aria-hidden="true">
      <div
        role="tooltip"
        className="absolute whitespace-nowrap text-white text-xs font-normal leading-4"
        style={{
          left: tip.x,
          top: tip.y,
          transform,
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          borderRadius: 'var(--borderRadius-lg)',
          background: 'var(--color-neutrals-400)',
        }}
      >
        {tip.text}
      </div>
    </div>
  );
}
