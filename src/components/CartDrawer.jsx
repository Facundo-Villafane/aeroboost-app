import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../admin/AuthProvider';
import { Link } from 'react-router';
import { 
  FaShoppingCart, 
  FaTimes, 
  FaPlus, 
  FaMinus, 
  FaTrash,
  FaCreditCard,
  FaTag
} from 'react-icons/fa';

const CartDrawer = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getCartTotal,
    getCartTotalOriginal,
    getCartItemsCount,
    getTotalSavings
  } = useCart();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleQuantityChange = (courseId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(courseId);
    } else {
      updateQuantity(courseId, newQuantity);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <FaShoppingCart className="text-2xl text-primary" />
                <h2 className="text-2xl font-bold text-primary">
                  Mi Carrito ({getCartItemsCount()})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes className="text-xl text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <FaShoppingCart className="text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Agrega algunos cursos para comenzar
                  </p>
                  <Link
                    to="/servicios"
                    onClick={onClose}
                    className="px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-accent transition-colors"
                  >
                    Ver Cursos
                  </Link>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {/* Clear Cart Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <FaTrash />
                      Vaciar carrito
                    </button>
                  </div>

                  {/* Cart Items */}
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      className="bg-gray-50 rounded-xl p-4"
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-primary text-sm leading-tight flex-1 mr-2">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <FaTimes className="text-sm" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="font-bold text-secondary">
                            ${(item.price * item.quantity).toLocaleString('es-AR')}
                          </div>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <div className="text-xs text-gray-500 line-through">
                              ${(item.originalPrice * item.quantity).toLocaleString('es-AR')}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer con totales y checkout */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {/* Savings */}
                {getTotalSavings() > 0 && (
                  <div className="flex items-center justify-between mb-3 text-green-600">
                    <div className="flex items-center gap-1">
                      <FaTag className="text-sm" />
                      <span className="font-semibold">Total ahorrado:</span>
                    </div>
                    <span className="font-bold">
                      ${getTotalSavings().toLocaleString('es-AR')}
                    </span>
                  </div>
                )}

                {/* Original Total */}
                {getCartTotalOriginal() > getCartTotal() && (
                  <div className="flex justify-between text-sm text-gray-500 line-through mb-1">
                    <span>Total original:</span>
                    <span>${getCartTotalOriginal().toLocaleString('es-AR')}</span>
                  </div>
                )}

                {/* Final Total */}
                <div className="flex justify-between text-xl font-bold text-primary mb-4">
                  <span>Total:</span>
                  <span>${getCartTotal().toLocaleString('es-AR')}</span>
                </div>

                {/* Checkout Button */}
                {user ? (
                  <button className="w-full bg-primary text-white font-semibold py-3 rounded-full hover:bg-accent transition-colors flex items-center justify-center gap-2">
                    <FaCreditCard />
                    Proceder al Pago
                  </button>
                ) : (
                  <Link 
                    to="/student/login"
                    onClick={onClose}
                    className="w-full bg-primary text-white font-semibold py-3 rounded-full hover:bg-accent transition-colors flex items-center justify-center gap-2"
                  >
                    <FaCreditCard />
                    Iniciar Sesión para Comprar
                  </Link>
                )}
                
                <div className="text-center mt-3">
                  <Link
                    to="/servicios"
                    onClick={onClose}
                    className="text-primary hover:text-accent text-sm underline"
                  >
                    Continuar comprando
                  </Link>
                </div>
              </div>
            )}
          </motion.div>

          {/* Clear Cart Confirmation */}
          <AnimatePresence>
            {showClearConfirm && (
              <motion.div
                className="fixed inset-0 bg-black/30 backdrop-blur-md z-60 flex items-center justify-center p-4"
                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
                exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              >
                <motion.div
                  className="bg-white rounded-2xl p-6 max-w-sm w-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <h3 className="text-xl font-bold text-primary mb-4">
                    ¿Vaciar carrito?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Esta acción eliminará todos los cursos de tu carrito. ¿Estás seguro?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleClearCart}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                      Vaciar
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;