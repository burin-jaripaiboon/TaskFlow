import WobbleText from '../components/effects/WobbleText';
import '../styles/layout/TestingLayout.css';


export default function TestingPage() {
  return (
    <div>
                <div>
                    <h1><WobbleText>Welcome to My App</WobbleText></h1>
                </div>
            

        <h2>
          Here is a subtitle
        </h2>

        <p>
          This is a paragraph explaining the features. It uses a standard p tag.
        </p>

        <div>
          <button>Log In</button>
          <button>Sign Up</button>
        </div>

    </div>
  );
}
