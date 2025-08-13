export const AnimatedSection: React.FC<{
  children: React.ReactNode;
  show: boolean;
  className?: string;
}> = ({ children, show, className = '' }) => (
  <div
    className={`overflow-hidden transition-all duration-300 ease-in-out ${
      show
        ? 'max-h-96 translate-y-0 transform opacity-100'
        : 'max-h-0 -translate-y-2 transform opacity-0'
    } ${className}`}
  >
    <div className={show ? 'p-1 pb-2' : ''}>{children}</div>
  </div>
);
