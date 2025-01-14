import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// import { auth, signOut } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export async function User() {
  // const session = await auth();
  // const user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="overflow-hidden rounded-full"
          size="icon"
          variant="outline"
        >
          <Image
            alt="Avatar"
            className="overflow-hidden rounded-full"
            height={36}
            src={'/placeholder-user.jpg'}
            width={36}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        {false ? (
          <DropdownMenuItem>
            <form
              action={async () => {
                'use server';
                // await signOut();
              }}
            >
              <button type="submit">Sign Out</button>
            </form>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem>
            <Link href="/login">Sign In</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
