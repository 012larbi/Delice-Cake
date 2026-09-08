import Reveal from './Reveal';

/**
 * En-tête de section : petit label + titre (avec mot en script) + sous-titre.
 */
export default function SectionHeading({
  label,
  title,
  script,
  subtitle,
  align = 'center',
  tone = 'dark', // 'dark' sur fond clair, 'light' sur fond burgundy
  className = '',
}) {
  const alignClass =
    align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left';
  const titleColor = tone === 'light' ? 'text-cream' : 'text-burgundy';
  const subColor = tone === 'light' ? 'text-blush/80' : 'text-burgundy/60';
  const labelColor =
    tone === 'light'
      ? 'text-blush border-blush/40'
      : 'text-accent border-accent/30';

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignClass} ${className}`}>
      {label && (
        <Reveal
          as="span"
          className={`inline-flex w-fit items-center rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${labelColor}`}
        >
          {label}
        </Reveal>
      )}
      <Reveal as="h2" delay={0.05} className={`text-4xl sm:text-5xl ${titleColor}`}>
        {title}{' '}
        {script && (
          <span className="font-script font-normal text-accent">{script}</span>
        )}
      </Reveal>
      {subtitle && (
        <Reveal as="p" delay={0.12} className={`text-base sm:text-lg ${subColor}`}>
          {subtitle}
        </Reveal>
      )}
    </div>
  );
}
