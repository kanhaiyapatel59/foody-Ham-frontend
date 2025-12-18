import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const CartAnimation = ({ startPosition, onComplete }) => {
  const [position, setPosition] = useState(startPosition);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const cartIcon = document.querySelector('[data-cart-icon]');
    if (!cartIcon) return;

    const cartRect = cartIcon.getBoundingClientRect();
    const duration = 800;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);

      setPosition({
        x: startPosition.x + (cartRect.left - startPosition.x) * easeOut,
        y: startPosition.y + (cartRect.top - startPosition.y) * easeOut,
      });

      setOpacity(1 - progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    animate();
  }, []);

  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="bg-orange-500 text-white p-3 rounded-full shadow-2xl animate-pulse">
        <FaShoppingCart className="text-2xl" />
      </div>
    </div>
  );
};

export default CartAnimation;
