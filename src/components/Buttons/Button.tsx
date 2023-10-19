export function Button({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={
        className ||
        'bg-blue-700 hover:bg-blue-900 text-gray-300 font-bold py-2 px-4 rounded mr-2'
      }
    >
      {children}
    </button>
  );
}

export function GreenButton({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={
        className ||
        'bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded mr-2'
      }
    >
      {children}
    </button>
  );
}