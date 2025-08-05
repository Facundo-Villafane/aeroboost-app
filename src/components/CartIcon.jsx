import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { FaShoppingCart } from 'react-icons/fa';
import CartDrawer from './CartDrawer';

const CartIcon = () => {
  const { getCartItemsCount } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const itemCount = getCartItemsCount();

  const handleToggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <motion.button
        onClick={handleToggleDrawer}
        className="relative p-2 text-white hover:text-secondary transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaShoppingCart className="text-xl" />
        
        {/* Badge */}
        {itemCount > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 bg-secondary text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.div>
        )}
      </motion.button>

      <CartDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </>
  );
};

export default CartIcon;