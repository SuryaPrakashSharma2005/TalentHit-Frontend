import { Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { getCompanySettings } from "@/lib/api";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar } = useSidebar();

  const [company, setCompany] = useState<{
    name?: string;
    logo?: string;
  } | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getCompanySettings();
        setCompany(data);
      } catch {
        // silent fail
      }
    };

    fetchCompany();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b bg-card shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">

        {/* Left Section */}
        <div className="flex items-center gap-4">

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Company Logo + Name */}
          <div className="flex items-center gap-3">
            {company?.logo ? (
              <img
                src={company.logo}
                alt="Company Logo"
                className="h-8 w-8 object-contain rounded"
              />
            ) : (
              <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center text-primary font-bold">
                {company?.name?.charAt(0) || "C"}
              </div>
            )}

            <span className="text-lg font-semibold">
              {company?.name || "Company"}
            </span>
          </div>
        </div>

        {/* Right Section */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>

      </div>
    </header>
  );
}