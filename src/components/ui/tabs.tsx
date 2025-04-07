
import * as React from "react";
import { cva } from "class-variance-authority";

const tabsVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground hover:text-primary",
        active: "bg-background text-primary shadow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const Tabs = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full flex flex-col space-y-4">{children}</div>;
};

export const TabsList = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex space-x-2 bg-muted p-1 rounded-md">{children}</div>;
};

export const TabsTrigger = ({
  children,
  onClick,
  active = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={tabsVariants({ variant: active ? "active" : "default" })}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-4 border rounded-md bg-white">{children}</div>;
};
