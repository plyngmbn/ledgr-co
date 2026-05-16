export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-red-500">Authentication Error</h1>
      <p className="text-gray-600 mt-2">We couldn't log you in. This usually happens if your session expired or the redirect URL is incorrect.</p>
      <a href="/login" className="mt-4 text-emerald-600 underline">Try logging in again</a>
    </div>
  );
}