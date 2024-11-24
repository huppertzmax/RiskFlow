import React from "react";
import {
  Flex,
  Image,
  MantineProvider,
  NavLink,
  Space,
  Title,
  Text,
  NavLinkProps,
} from "@mantine/core";
import {
  IconArrowGuideFilled,
  IconChevronLeft,
  IconLayoutDashboard,
  IconListCheck,
} from "@tabler/icons-react";
import Providers from "./providers";
import { SearchInput } from "./search";
import { StatusIcon } from "./status-icon";
import { User } from "./user";
import { isLoadingAnalysis } from "./actions/analysis-db-actions";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/lib/auth";

// Main Layout Component
export default async function DashboardLayout({
                                          children,
                                        }: {
  children: React.ReactNode;
}) {
  const session = await auth()
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  })
  return (
    <Providers>
      <MantineProvider>
        <main
          className="flex min-h-screen w-full flex-col bg-muted/40"
          style={{ background: "#000028" }}
        >
          <DesktopNavMain />
          <div className="flex flex-col sm:gap-4 ml-[200px] mr-4">
            <Space h={20} />
            <Header name={session ? "Hello, " + session?.user?.name : currentDate} />
            <MainContent>{children}</MainContent>
            <Toaster />
          </div>
        </main>
      </MantineProvider>
    </Providers>
  );
}

// Header Component
function Header({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Investigation name={name} />
      <SearchInput />
      <User />
    </header>
  );
}

// Investigation Component
function Investigation({ name }: { name: string }) {
  return (
    <Flex
      direction={{ base: "column", sm: "row" }}
      gap={{ base: "sm" }}
      justify={{ sm: "center" }}
      style={{ color: "#FFFFFF", paddingLeft: 30 }}
      align={"center"}
    >
      <IconChevronLeft stroke={3} />
      <Title order={2}>{name}</Title>
    </Flex>
  );
}

// Custom Navigation Link Component
interface CustomNavLinkProps extends NavLinkProps {
  fontSize?: string; // Optional font size prop
}

export function CustomNavLink({
                                fontSize = "1rem",
                                label,
                                ...props
                              }: CustomNavLinkProps) {
  return (
    <NavLink
      {...props}
      label={
        <Text size={fontSize} style={{ fontWeight: "bold" }}>
          {label}
        </Text>
      }
    />
  );
}

// Desktop Navigation Menu
function DesktopNavMain() {
  const navItems = [
    {
      href: "/report",
      label: "Report",
      icon: <IconLayoutDashboard size="1.5rem" stroke={1.5} />,
      rightSection: <StatusIcon isLoadingAnalysis={isLoadingAnalysis} />,
    },
    {
      href: "/management",
      label: "Management",
      icon: <IconListCheck size="1.5rem" stroke={1.5} />,
    },
    {
      href: "/investigation",
      label: "Investigation",
      icon: <IconArrowGuideFilled size="1.5rem" stroke={1.5} />,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden flex-col sm:flex">
      <Space h={25} />
      <Image
        h={90}
        w={200}
        src="/Images/Siemens-logo.png"
        style={{ padding: 20 }}
      />
      <nav className="flex flex-col items-stretch gap-4 sm:py-5 text-white font-bold w-[200px]">
        {navItems.map((item) => (
          <CustomNavLink
            key={item.href}
            href={item.href}
            label={item.label}
            leftSection={item.icon}
            rightSection={item.rightSection}
            className="w-full px-5 text-white hover:text-black rounded-sm duration-150"
            fontSize="1.2rem" // Adjust font size here
          />
        ))}
      </nav>
    </aside>
  );
}

// Main Content Component
function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid flex-1 items-start gap-2 m-4 md:gap-4 bg-muted/40 min-h-[88vh] pb-12 bg-white rounded-lg">
      {children}
    </main>
  );
}
