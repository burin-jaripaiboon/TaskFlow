import '../styles/FadingText.css';
import styles from '../styles/layout/WelcomeLayout.module.css';
import SequentialAnimation from '../components/effects/SequentialAnimation';
import WobbleText from '../components/effects/WobbleText';
import { Link } from 'react-router-dom';

export default function WelcomePage() {
  return (
    <div className={styles.container}>
      <SequentialAnimation>
        <h2 className={styles.subtitle}>
          Welcome to
        </h2>
      </SequentialAnimation>
      <SequentialAnimation delay={1}>
        <h1 className={`${styles.title}`}
            style={{
                    color: 'rgb(18, 28, 172)', 
                    fontWeight: 700, 
                    letterSpacing: '0',
                    lineHeight: '80%',
                    margin: '0.3em 0 0.2em 0'
                  }} >
                    <WobbleText>
                      TaskFlow
                    </WobbleText>
        </h1>
      </SequentialAnimation>
      <SequentialAnimation delay={2}>
        <p className={`animate-fading-text ${styles.normalText}`} 
            style={{ fontSize: '18px', marginTop: '0em' , animationDelay: '2.5s', '--fading-text-color': '#292828'} as React.CSSProperties}>
          A simplified task management solution.
        </p>
      </SequentialAnimation>
      <SequentialAnimation delay={3}>
        <Link className='link-color' to="/login">Login</Link>
        <Link className='link-color' to="/register">Register</Link>
      </SequentialAnimation>
    </div>
  );
}