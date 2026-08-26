import '../../styles/Wobble.css';

interface WobbleTextProps {
  children: string;
  init_delay?: number;
}

export default function WobbleText({ children, init_delay = 0 }: WobbleTextProps) {
  const characters = children.split("");

  return (
    <div className='wobble'>
      {characters.map((char, index) => {
        const delay = (index + 1) * 50 + (init_delay * 1000);
    
        return (
          <span
            key={index}
            style={{ animationDelay: `${delay}ms` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </div>
  );
}