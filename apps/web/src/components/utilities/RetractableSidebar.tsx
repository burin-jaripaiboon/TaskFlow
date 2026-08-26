import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../../styles/Sidebar.module.css';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Projects', path: '/projects', icon: '📁' },
  { name: 'Tasks', path: '/tasks', icon: '✅' },
];
export default function RetractableSidebar({ setIsLoggedIn }: { setIsLoggedIn: (val: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutModal(true); 
  };

  // 3. The actual logout logic (only runs if confirmed)
  const confirmLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <motion.aside
      className={styles.sidebar}
      animate={{ width: isOpen ? 250 : 70 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >

      <button 
        className={styles.toggleButton} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.icon}>☰</span>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              TaskFlow
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <nav className={styles.navMenu}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.icon}>{link.icon}</span>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>
      <button 
        className={styles.logoutButton} 
        onClick={handleLogoutClick}
        style={{ marginTop: 'auto',  }}
      >
        <span className={styles.icon}>➜]</span>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Logout
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={styles.modalCard}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to securely log out of TaskFlow?</p>
              
              <div className={styles.modalActions}>
                <button 
                  className={styles.cancelBtn} 
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className={styles.confirmBtn} 
                  onClick={confirmLogout}
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}