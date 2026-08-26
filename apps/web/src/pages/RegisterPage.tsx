import RegisterForm from '../features/RegisterForm';

export default function RegisterPage({ setIsLoggedIn }: { setIsLoggedIn: (isLoggedIn: boolean) => void }) {
  return (
    <div>
      <RegisterForm setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
}