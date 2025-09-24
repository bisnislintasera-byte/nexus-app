export function NexusLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 48L48 152.276V359.724L256 464L464 359.724V152.276L256 48ZM432 339.276L256 427.724L80 339.276V172.724L256 84.276L432 172.724V339.276Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 152L152 204V308L256 360L360 308V204L256 152ZM328 289.724L256 327.724L184 289.724V222.276L256 184.276L328 222.276V289.724Z"
      />
      <circle cx="256" cy="256" r="32" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 224C238.327 224 224 238.327 224 256C224 273.673 238.327 288 256 288C273.673 288 288 273.673 288 256C288 238.327 273.673 224 256 224ZM244 256C244 249.373 249.373 244 256 244C262.627 244 268 249.373 268 256C268 262.627 262.627 268 256 268C249.373 268 244 262.627 244 256Z"
      />
    </svg>
  );
}