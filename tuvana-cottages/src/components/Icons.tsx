/** Line icons matching the four promises printed on the flyer. */

type IconProps = { className?: string };

const base = "h-full w-full";

export function ShieldIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2.6 4.8 5.5v5.9c0 4.4 3 8.3 7.2 9.9 4.2-1.6 7.2-5.5 7.2-9.9V5.5Z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </svg>
  );
}

export function FlameIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2.8c1.4 3 4.6 4.6 4.6 8.6a4.6 4.6 0 0 1-9.2 0c0-1.4.4-2.4 1-3.3.5 1 1.3 1.6 2 1.6-.3-2.6.5-5.2 1.6-6.9Z" />
      <path d="M12 21.2a3.1 3.1 0 0 1-3.1-3.1c0-1.8 1.7-2.8 3.1-5 1.4 2.2 3.1 3.2 3.1 5a3.1 3.1 0 0 1-3.1 3.1Z" />
    </svg>
  );
}

export function LeafIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4.5 19.5c-1.4-6.2 2.2-12.4 9.2-13.4 2-.3 4-.2 5.8.3.5 7.6-3.9 13.7-10.4 14.1a8.6 8.6 0 0 1-4.6-1Z" />
      <path d="M4.8 20.2c2.2-4.6 5.6-8 10-10.2" />
    </svg>
  );
}

export function LockIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="4.5" y="10.2" width="15" height="10.6" rx="2.4" />
      <path d="M8.2 10.2V7.6a3.8 3.8 0 0 1 7.6 0v2.6" />
      <path d="M12 14.4v2.4" />
    </svg>
  );
}

export function PinIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 21.5c4.2-4.4 6.4-7.8 6.4-10.6a6.4 6.4 0 1 0-12.8 0c0 2.8 2.2 6.2 6.4 10.6Z" />
      <circle cx="12" cy="10.6" r="2.5" />
    </svg>
  );
}

export function PhoneIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6.4 3.5h3l1.5 3.8-2.1 1.3a12 12 0 0 0 5.6 5.6l1.3-2.1 3.8 1.5v3a2 2 0 0 1-2.2 2C10.6 18 6 13.4 4.4 5.7a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

export function WhatsappIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.55 3.75 1.5 5.29L2 22.5l5.53-1.66a9.8 9.8 0 0 0 4.51 1.12h.01c5.44 0 9.84-4.4 9.84-9.84S17.48 2 12.04 2Zm0 17.98h-.01a8.2 8.2 0 0 1-4.16-1.14l-.3-.18-3.09.93.94-3.01-.2-.31a8.1 8.1 0 0 1-1.25-4.36 8.18 8.18 0 1 1 8.07 8.07Zm4.5-6.1c-.25-.13-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12s-.64.8-.79.97-.29.18-.54.06a6.7 6.7 0 0 1-1.97-1.22 7.4 7.4 0 0 1-1.36-1.7c-.14-.24 0-.37.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.47c-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.66 4.2 3.73.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.66-1.17.21-.58.21-1.07.15-1.17-.06-.11-.23-.18-.48-.3Z" />
    </svg>
  );
}

export function ClockIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 1.9" />
    </svg>
  );
}

export function CopyIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2.2" />
      <path d="M15 5.6A1.6 1.6 0 0 0 13.4 4H6a2 2 0 0 0-2 2v7.4A1.6 1.6 0 0 0 5.6 15" />
    </svg>
  );
}

export function CheckIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function UsersIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
      <path d="M16.5 5.2a3.2 3.2 0 0 1 0 5.9M17.5 14.6a5.5 5.5 0 0 1 3 4.9" />
    </svg>
  );
}

export function BedIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 18v-8M3 14h18v4M21 18v-4a3 3 0 0 0-3-3h-7v3" />
      <circle cx="7" cy="11" r="1.8" />
    </svg>
  );
}

export function BathIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3.5 12h17v2.6a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4Z" />
      <path d="M6.5 12V6.4a2 2 0 0 1 3.6-1.2M6 18.6 5 21M18 18.6 19 21" />
    </svg>
  );
}
