const RightCaret = ({ className }: { className?: string }) => (
  <svg
    width={16}
    height={20}
    viewBox="0 0 16 20"
    fill="currentColor" // Use current text color
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x={6} y={3} width={2} height={2} />
    <rect x={9} y={6} width={2} height={2} />
    <rect x={12} y={9} width={2} height={2} />
    <rect x={6} y={9} width={2} height={2} />
    <rect x={9} y={12} width={2} height={2} />
    <rect x={6} y={15} width={2} height={2} />
  </svg>
);

export default RightCaret;
