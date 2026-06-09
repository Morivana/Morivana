import { useState } from 'react'
import PropTypes from 'prop-types'

/**
 * Single FAQ item with pure-CSS grid-row animation.
 * No JS height measurement uses grid-template-rows: 0fr → 1fr
 * for perfectly smooth, jank-free expand/collapse.
 */
function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div style={{ borderBottom: '1px solid var(--line-soft)' }}>
      {/* Question button */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '20px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: '0.95rem',
          color: 'var(--surface-deep)',
          textAlign: 'left',
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <span style={{ flex: 1 }}>{question}</span>
        <span
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '1.5px solid var(--line-soft)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            lineHeight: 1,
            flexShrink: 0,
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition:
              'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), ' +
              'background 0.3s ease, ' +
              'border-color 0.3s ease, ' +
              'color 0.3s ease',
            color: isOpen ? 'var(--surface-base)' : 'var(--ink-soft)',
            background: isOpen ? 'var(--surface-deep)' : 'transparent',
            borderColor: isOpen ? 'var(--surface-deep)' : 'var(--line-soft)',
          }}
        >
          +
        </span>
      </button>

      {/* Animated answer CSS grid-row trick for smooth expand/collapse */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <p
            style={{
              color: 'var(--ink-soft)',
              lineHeight: 1.75,
              padding: '0 0 24px',
              margin: 0,
              fontSize: '0.9rem',
              fontFamily: 'var(--font-body)',
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0)' : 'translateY(-6px)',
              transition:
                'opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1) 0.05s, ' +
                'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1) 0.05s',
            }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

FAQItem.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
}

/**
 * FAQAccordion component
 * @param {Array} items - Array of FAQ items. Accepts { q, a } or { question, answer } format.
 * @param {string} [title] - Optional section kicker title (e.g. "FAQ", "Common Questions")
 * @param {string} [maxWidth='640px'] - Max width of the accordion container
 * @param {boolean} [allowMultiple=false] - Allow multiple items open simultaneously
 */
export default function FAQAccordion({
  items = [],
  title,
  maxWidth = '640px',
  allowMultiple = false,
}) {
  const [openIndexes, setOpenIndexes] = useState(new Set())

  const toggle = (index) => {
    setOpenIndexes((prev) => {
      const next = new Set(allowMultiple ? prev : [])
      if (prev.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  if (!items.length) return null

  return (
    <div style={{ maxWidth, display: 'flex', flexDirection: 'column', gap: '0' }}>
      {title && (
        <div
          className="kicker"
          style={{ marginBottom: '20px', color: 'var(--ink-mute)' }}
        >
          {title}
        </div>
      )}
      {items.map((item, i) => (
        <FAQItem
          key={i}
          question={item.q || item.question}
          answer={item.a || item.answer}
          isOpen={openIndexes.has(i)}
          onToggle={() => toggle(i)}
        />
      ))}
    </div>
  )
}

FAQAccordion.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    q: PropTypes.string,
    a: PropTypes.string,
    question: PropTypes.string,
    answer: PropTypes.string,
  })),
  title: PropTypes.string,
  maxWidth: PropTypes.string,
  allowMultiple: PropTypes.bool,
}
