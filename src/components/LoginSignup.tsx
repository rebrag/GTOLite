// src/components/LoginSignup.tsx
import Layout from "./Layout";

const LoginSignup = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-start p-4 flex-grow space-y-6">
        <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg mt-8">
          <h2 className="text-2xl font-bold mb-6 text-center [text-shadow:2px_2px_4px_rgba(0,0,0,0.3)]">
            Offline Demo Mode
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Login is disabled in this static version of HoldemTools. You can freely explore sample data without signing in.
          </p>
          <button
            onClick={() => window.location.href = "/"}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 ease-in-out"
          >
            Go to Solver
          </button>
        </div>
        <div className="text-center select-none">© Josh Garber 2025</div>
      </div>
    </Layout>
  );
};

export default LoginSignup;
