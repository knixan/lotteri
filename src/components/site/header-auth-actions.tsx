"use client";

import { LogOut, Shield, Ticket, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { signOutUser } from "@/lib/firebase/auth";

export function HeaderAuthActions() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOutUser();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <div className="h-9 w-24 animate-pulse rounded-md bg-brand-foreground/10" />;
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="border-brand-foreground/30 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground"
          >
            <User className="size-4" />
            {user.displayName ?? "Mitt konto"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/mina-sidor">
              <Ticket className="size-4" />
              Mina sidor
            </Link>
          </DropdownMenuItem>
          {profile?.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <Shield className="size-4" />
                Admin
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="size-4" />
            Logga ut
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        asChild
        className="hidden border-brand-foreground/30 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground sm:inline-flex"
      >
        <Link href="/logga-in">
          <User className="size-4" />
          Logga in
        </Link>
      </Button>
      <Button asChild className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90">
        <Link href="/lotteriet">Köp lotter</Link>
      </Button>
    </>
  );
}
