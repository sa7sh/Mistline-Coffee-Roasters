import { useState } from "react";

function CoffeeImage({ src, alt, className }) {
  const [failedSrc, setFailedSrc] = useState("");
  const failed = !src || failedSrc === src;

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-stone-200 px-3 text-center text-sm text-stone-600 ${className}`}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
}

export default CoffeeImage;
