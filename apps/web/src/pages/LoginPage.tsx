import LoginForm from '../features/LoginForm';

export default function LoginPage({ setIsLoggedIn }: { setIsLoggedIn: (isLoggedIn: boolean) => void }) {
  return (
    <div>
      <title>Login | TaskFlow</title>
      <LoginForm setIsLoggedIn={setIsLoggedIn}/>
    </div>
  );
}
