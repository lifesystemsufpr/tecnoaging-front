function CardBackgroundIcon({ children: Icon, className = "" }) {
  if (!Icon) return null;

  const defaultClass =
    "absolute right-2 bottom-2 opacity-10 pointer-events-none";

  const finalClassName = className
    ? `${defaultClass} ${className}`
    : defaultClass;

  return <div className={finalClassName}>{Icon}</div>;
}

export default CardBackgroundIcon;
