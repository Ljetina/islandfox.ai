import Image from 'next/image';

import {
  LoginButton,
  LogoutButton,
  ProfileButton,
  RegisterButton,
} from '@/components/buttons.component';
import { getServerSession } from '@/lib/auth';

export default async function Home() {
  const session = await getServerSession()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div>
          {!session && <LoginButton />}
          {!!session && <LogoutButton />}
        </div>
      </div>
    </main>
  );
}
