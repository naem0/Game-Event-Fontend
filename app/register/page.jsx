import { RegisterForm } from "@/components/register-form"

export default function RegisterPage({ searchParams }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-3xl font-bold">Register</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <RegisterForm referralCode={searchParams.ref} />
        </Suspense>
      </div>
    </div>
  )
}

