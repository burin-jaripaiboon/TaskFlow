import { useNavigate } from 'react-router-dom';
import type { ButtonHTMLAttributes } from 'react';

// 1. Inherit all standard button properties, and add our custom 'to' property
interface NavButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  to: string;
}

export default function NavButton({ to, onClick, children, ...restOfProps }: NavButtonProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
    navigate(to);
  };

  return (
    <button 
      onClick={handleClick} 
      {...restOfProps}
    >
      {children}
    </button>
  );
}