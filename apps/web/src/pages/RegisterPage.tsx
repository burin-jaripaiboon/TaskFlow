import RegisterForm from '../features/RegisterForm';

export default function RegisterPage({ setIsLoggedIn }: { setIsLoggedIn: (isLoggedIn: boolean) => void }) {
  return (
    <div>
      <title>Register | TaskFlow</title>
      <RegisterForm setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
}
