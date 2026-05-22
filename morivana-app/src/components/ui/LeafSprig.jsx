export default function LeafSprig({
  size = 120,
  leafFill = 'var(--accent)',
  stroke = 'var(--surface-deep)',
  strokeWidth = 14,
  opacity = 1,
  style = {},
  ...rest
}) {
  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ opacity, ...style }}
      {...rest}
    >
      <g fill={leafFill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {/* Center stem */}
        <line x1="256" y1="100" x2="256" y2="480" fill="none" />

        {/* Top leaf */}
        <ellipse cx="256" cy="78" rx="38" ry="52" />

        {/* Upper pair */}
        <line x1="256" y1="160" x2="200" y2="135" fill="none" />
        <line x1="256" y1="160" x2="312" y2="135" fill="none" />
        <ellipse cx="188" cy="125" rx="44" ry="34" transform="rotate(-20 188 125)" />
        <ellipse cx="324" cy="125" rx="44" ry="34" transform="rotate(20 324 125)" />

        {/* Middle pair (largest) */}
        <line x1="256" y1="230" x2="190" y2="220" fill="none" />
        <line x1="256" y1="230" x2="322" y2="220" fill="none" />
        <ellipse cx="178" cy="215" rx="52" ry="40" transform="rotate(-15 178 215)" />
        <ellipse cx="334" cy="215" rx="52" ry="40" transform="rotate(15 334 215)" />

        {/* Lower-middle pair */}
        <line x1="256" y1="320" x2="200" y2="320" fill="none" />
        <line x1="256" y1="320" x2="312" y2="320" fill="none" />
        <ellipse cx="186" cy="320" rx="40" ry="30" transform="rotate(-10 186 320)" />
        <ellipse cx="326" cy="320" rx="40" ry="30" transform="rotate(10 326 320)" />

        {/* Bottom inner pair */}
        <line x1="256" y1="380" x2="216" y2="385" fill="none" />
        <line x1="256" y1="380" x2="296" y2="385" fill="none" />
        <ellipse cx="200" cy="388" rx="32" ry="24" transform="rotate(-8 200 388)" />
        <ellipse cx="312" cy="388" rx="32" ry="24" transform="rotate(8 312 388)" />

        {/* Bottom outer pair */}
        <line x1="256" y1="410" x2="180" y2="420" fill="none" />
        <line x1="256" y1="410" x2="332" y2="420" fill="none" />
        <ellipse cx="166" cy="424" rx="34" ry="24" transform="rotate(-25 166 424)" />
        <ellipse cx="346" cy="424" rx="34" ry="24" transform="rotate(25 346 424)" />
      </g>
    </svg>
  )
}
