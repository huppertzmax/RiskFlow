import { User } from './user';
import Providers from './providers';
import { SearchInput } from './search';
import { MantineProvider, NavLink, Space, Image, Title, Button, Flex } from '@mantine/core';
import {
  IconArrowGuideFilled, IconChevronLeft,
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

        <main className="flex min-h-screen w-full flex-col bg-muted/40" style={{ background: "#000028" }}>
          < DesktopNavMain />
          <div className="flex flex-col sm:gap-4 ml-[200px] mr-4" >
            <Space h={20} />
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
              <Investigation />
              <SearchInput />
              <User />
            </header>
            <main className="grid flex-1 items-start gap-2 m-4 md:gap-4 bg-muted/40 min-h-[88vh] pb-12 bg-white rounded-lg">
              {children}
            </main>
          </div>
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
        gap={{ base: 'sm' }}
        justify={{ sm: 'center' }}
        style={{ color: "#FFFFFF", paddingLeft: 30 }}
        align={'center'}
      >
        <IconChevronLeft stroke={3} />
        <Title order={2}>Investigation 23</Title>

      </Flex>

    </>

  )
}


function DesktopNavMain() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden flex-col sm:flex">
      <Space h={25} />
      <Image
        h={90}
        w={200}
        src="/Images/RiskFlow-Logo.png"
        style={{ padding: 20 }}
      />

      <nav className="flex flex-col items-stretch gap-4 sm:py-5 text-white font-bold w-[200px]">
        <NavLink
          href="/report"
          label="Report"
          leftSection={<IconLayoutDashboard size="1rem" stroke={1.5} className="hover:text-black duration-150" />}
          className="w-full px-5 text-white hover:text-black rounded-sm duration-150"
        />
        <NavLink
          href="/management"
          label="Management"
          leftSection={<IconListCheck size="1rem" stroke={1.5} className="hover:text-black duration-150" />}
          className="w-full px-5 text-white hover:text-black rounded-sm duration-150"
        />
        <NavLink
          href="/investigation"
          label="Investigation"
          leftSection={<IconArrowGuideFilled size="1rem" stroke={1.5} className="hover:text-black duration-150" />}
          className="w-full px-5 text-white hover:text-black rounded-sm duration-150"
        />
      </nav>
    </aside>
  );
}

