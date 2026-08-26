import LoginForm from '../features/LoginForm';

export default function LoginPage({ setIsLoggedIn }: { setIsLoggedIn: (isLoggedIn: boolean) => void }) {
  return (
    <div>
      <LoginForm setIsLoggedIn={setIsLoggedIn}/>
    </div>
  );
}