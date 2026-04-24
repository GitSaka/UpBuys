import React, { useEffect, useRef, useState } from 'react';

const Reveal = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // On arrête d'observer une fois affiché
        }
      },
      { threshold: 0.1 } // Se déclenche quand 10% de l'élément est visible
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ 
        transitionDelay: `${delay}ms`,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        opacity: isVisible ? 1 : 0
      }}
      className="transition-all duration-1000 ease-out"
    >
      {children}
    </div>
  );
};

export default Reveal;