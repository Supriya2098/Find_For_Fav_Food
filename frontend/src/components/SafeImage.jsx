import { useState } from 'react';

export default function SafeImage({ src, alt, className, fallback = '🍽️' }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-stone-100 text-2xl ${className}`}>
        {fallback}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
