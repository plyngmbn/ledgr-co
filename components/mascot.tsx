export function Mascot({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top tabs/ears - slightly tilted for cuteness */}
      <rect x="8" y="6" width="11" height="11" rx="2.5" fill="#7DC9A6" transform="rotate(-5 13.5 11.5)" />
      <rect x="45" y="6" width="11" height="11" rx="2.5" fill="#E8C9A0" transform="rotate(5 50.5 11.5)" />
      
      {/* Wallet body - main, rounder */}
      <rect x="4" y="16" width="56" height="40" rx="12" fill="#4A9B7F" />
      
      {/* Wallet body - left shadow/stripe */}
      <path d="M4 28 L4 44 C4 50.627 9.373 56 16 56 L16 16 C9.373 16 4 21.373 4 28 Z" fill="#3D8268" />
      <rect x="12" y="16" width="5" height="40" fill="#3D8268" />
      
      {/* Clasp button - outer */}
      <rect x="42" y="25" width="14" height="14" rx="4" fill="#E8C9A0" />
      {/* Clasp button - inner circle */}
      <circle cx="49" cy="32" r="4" fill="#D4A574" />
      
      {/* Eyes - white, bigger and rounder */}
      <circle cx="22" cy="35" r="9" fill="white" />
      <circle cx="38" cy="35" r="9" fill="white" />
      
      {/* Pupils - looking slightly up for cute expression */}
      <circle cx="24" cy="34" r="4.5" fill="#2D2D2D" />
      <circle cx="40" cy="34" r="4.5" fill="#2D2D2D" />
      
      {/* Eye shine/sparkle */}
      <circle cx="22" cy="32" r="2" fill="white" />
      <circle cx="38" cy="32" r="2" fill="white" />
      <circle cx="26" cy="36" r="1" fill="white" />
      <circle cx="42" cy="36" r="1" fill="white" />
      
      {/* Rosy cheeks - pink blush */}
      <ellipse cx="10" cy="44" rx="5" ry="3" fill="#E8A0A0" opacity="0.5" />
      <ellipse cx="54" cy="44" rx="5" ry="3" fill="#E8A0A0" opacity="0.5" />
      
      {/* Mouth - bigger happier smile */}
      <path
        d="M24 47 Q31 54 38 47"
        stroke="#2D5A4A"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function MascotLarge({ className = "w-16 h-16" }: { className?: string }) {
  return <Mascot className={className} />;
}
