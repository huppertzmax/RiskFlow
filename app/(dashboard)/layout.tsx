import { Analytics } from '@vercel/analytics/react';
import { User } from './user';
import Providers from './providers';
import { SearchInput } from './search';
import { MantineProvider, NavLink, Space, Image, Title, Button, Flex } from '@mantine/core';
import {
  IconArrowGuideFilled,
  IconLayoutDashboard,
  IconListCheck, IconSquareRoundedArrowLeft
} from '@tabler/icons-react';
import React from 'react';
import { white } from 'next/dist/lib/picocolors';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <MantineProvider>

      <main className="flex min-h-screen w-full flex-col bg-muted/40" style={{background: "#000028"}}>
        < DesktopNavMain />
        <div className="flex flex-col sm:gap-4" style={{marginLeft: 200}}>
          <Space h={20}/>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Investigation/>
            <SearchInput />
            <User />
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
        <Analytics />
      </main>
      </MantineProvider>
    </Providers>
  );
}

function Investigation() {
  return (
    <>
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 'sm', sm: 'lg' }}
        justify={{ sm: 'center' }}
        style={{color: "#FFFFFF"}}
      >
        <IconSquareRoundedArrowLeft/>
        <Title order={2}>This is h1 title</Title>

      </Flex>

    </>

  )
}


  function DesktopNavMain() {
    return (
      <aside className="fixed inset-y-0 left-0 z-10 hidden flex-col bg-background sm:flex"
             style={{ background: "#000028", }}>
        <Space h={25} />
        <Image
          h={70}
          src="/Images/Siemens-Logo.png"
          style={{ padding: 20 }}
        />

        <nav className="flex flex-col items-center gap-4 sm:py-5 text-white font-bold">
          <NavLink
            href="/report"
            label="Report  "
            leftSection={<IconLayoutDashboard size="1rem" stroke={1.5} color="white" />}
            style={{ width: 200, paddingLeft: 20 }} />
          <NavLink
            href="/management"
            label="Management"
            leftSection={<IconListCheck size="1rem" stroke={1.5} />}
            style={{ width: 200, paddingLeft: 20 }}
          />
          <NavLink
            href="/investigation"
            label="Investigation"
            leftSection={<IconArrowGuideFilled size="1rem" stroke={1.5} />}
            style={{ width: 200, paddingLeft: 20 }}
          />
        </nav>
      </aside>
    );
  }

