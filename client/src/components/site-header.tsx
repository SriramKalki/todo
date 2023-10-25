"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import { ModeToggle } from "./theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CommandMenu } from "./ui/command-menu";

export default function SiteHeader() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const username = user.firstName?.substring(0, 2).toUpperCase();

  return (
    <>
      <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <MainNav />
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <CommandMenu />
            </div>
            <nav className="flex items-center">
              <div className="px-2">
                <ModeToggle />
              </div>
              {/* @ts-ignore */}
              <UserButton>
                <Avatar>
                  <AvatarImage src={user?.profileImageUrl}></AvatarImage>
                  <AvatarFallback>{username}</AvatarFallback>
                </Avatar>
              </UserButton>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
