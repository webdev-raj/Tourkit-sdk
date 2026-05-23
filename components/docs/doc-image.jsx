export default function DocImage({ src, alt, caption, placeholder }) {
  if (!src) {
    return (
      <div
        style={{
          width: '100%',
          background: '#0d0d0d',
          border: '1px dashed rgba(255,255,255,0.1)',
          borderRadius: '10px',
          padding: '48px 24px',
          textAlign: 'center',
          margin: '24px 0',
        }}>
        <div
          style={{
            fontSize: '32px',
            marginBottom: '8px',
          }}>
          🖼️
        </div>
        <p
          style={{
            color: '#444',
            fontSize: '13px',
            margin: 0,
          }}>
          {placeholder || 'Screenshot coming soon'}
        </p>
      </div>
    )
  }

  return (
    <figure style={{ margin: '24px 0' }}>
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'block',
        }}
      />
      {caption ? (
        <figcaption
          style={{
            color: '#666',
            fontSize: '12px',
            textAlign: 'center',
            marginTop: '8px',
          }}>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
