"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface LinkItem {
  name: string;
  path: string;
  permission: string;
  section: string | null;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const toggleDropdown = (section: string) => {
    setOpenDropdowns(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // ⭐ Sidebar Items
  const allLinks: LinkItem[] = [
    // MAIN ITEMS
    { name: "Home", path: "/panel/dashboard", permission: "dashboard", section: null },
    { name: "Analytics", path: "/panel/analytics", permission: "analytics", section: "Dashboard" },
    { name: "Role Management", path: "/panel/roles", permission: "roles", section: "Roles" },


    // USERS & OWNERS
    { name: "All Users", path: "/panel/users", permission: "users", section: "Users & Owners" },
    { name: "Reported Users", path: "/panel/users/reported", permission: "users", section: "Users & Owners" },
    { name: "Blocked Users", path: "/panel/users/blocked", permission: "users", section: "Users & Owners" },
    { name: "Blocked Users", path: "/panel/users/blocked", permission: "users_blocked", section: "Users & Owners" },
    { name: "All Owners", path: "/panel/owners", permission: "owners", section: "Users & Owners" },
    { name: "Pending Owners", path: "/panel/owners/pending", permission: "owners_pending", section: "Users & Owners" },
    { name: "Verified Owners", path: "/panel/owners/verified", permission: "owners_verified", section: "Users & Owners" },

    // PROPERTIES
    { name: "All Properties", path: "/panel/properties", permission: "properties", section: "Properties" },
    { name: "Pending Approval", path: "/panel/properties/pending", permission: "properties_pending", section: "Properties" },
    { name: "Verified Properties", path: "/panel/properties/verified", permission: "properties_verified", section: "Properties" },
    { name: "Rejected Properties", path: "/panel/properties/rejected", permission: "properties_rejected", section: "Properties" },
    { name: "Reported Properties", path: "/panel/properties/reported", permission: "properties_reported", section: "Properties" },

    // ROOMS
    { name: "All Rooms", path: "/panel/rooms", permission: "rooms", section: "Rooms" },
    { name: "Room Availability", path: "/panel/rooms/availability", permission: "rooms_availability", section: "Rooms" },

    // BOOKINGS
        { name: "Bookings", path: "/panel/bookings", permission: "rooms", section: "Bookings" },


    // CITIES & AREAS
    { name: "Cities List", path: "/panel/cities", permission: "cities", section: "Cities & Areas" },
    { name: "Add City", path: "/panel/cities/add", permission: "cities_add", section: "Cities & Areas" },
    { name: "Localities", path: "/panel/localities", permission: "localities", section: "Cities & Areas" },

    // AMENITIES
    { name: "Amenity List", path: "/panel/amenities", permission: "amenities", section: "Amenities" },
    { name: "Add Amenity", path: "/panel/amenities/add", permission: "amenities_add", section: "Amenities" },

    // INQUIRIES
    { name: "All Inquiries", path: "/panel/inquiries", permission: "inquiries", section: "Inquiries" },
    { name: "Property-wise Inquiries", path: "/panel/inquiries/property", permission: "inquiries_property", section: "Inquiries" },

    // ADVANCED
    { name: "Reviews & Reports", path: "/panel/reviews", permission: "reviews", section: "Advanced" },
    { name: "Payments", path: "/panel/payments", permission: "payments", section: "Advanced" },
    { name: "Notifications", path: "/panel/notifications", permission: "notifications", section: "Advanced" },
    { name: "CMS", path: "/panel/cms", permission: "cms", section: "Advanced" },
    { name: "Audit Logs", path: "/panel/logs", permission: "audit_logs", section: "Advanced" },

    // SETTINGS
    { name: "Settings", path: "/panel/settings", permission: "settings", section: "Settings" },
    { name: "Logout", path: "/panel/logout", permission: "logout", section: "Settings" },
  ];

  useEffect(() => {
    const r = localStorage.getItem("role");
    const p = localStorage.getItem("permissions");

    if (r) setRole(r);

    if (p) {
      try {
        const parsed = JSON.parse(p);
        if (Array.isArray(parsed)) setPermissions(parsed);
      } catch {
        setPermissions([]);
      }
    }
  }, []);

  if (!role) return null;

  // filter visible
  const visibleLinks = allLinks.filter(link =>
    permissions.includes(link.permission)
  );

  // separate
  const topLevel = visibleLinks.filter(link => link.section === null);
  const grouped = visibleLinks.reduce((acc: Record<string, LinkItem[]>, link) => {
    if (link.section !== null) {
      if (!acc[link.section]) acc[link.section] = [];
      acc[link.section].push(link);
    }
    return acc;
  }, {});

  return (
    <aside className="w-64 bg-[#0d1b2a] text-gray-200 h-full flex flex-col">

      {/* SIDEBAR HEADER */}
      <div className="sticky top-0 bg-[#0d1b2a] z-10 text-lg font-bold tracking-wide py-5 px-6 border-b border-white/10 shadow-sm">
        {role === "ADMIN" ? "Admin Panel" : "Owner Panel"}
      </div>

      {/* NAV AREA */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-4">

        {/* 🔵 TOP-LEVEL LINKS */}
        <div className="space-y-1">
          {topLevel.map(link => (
            <Link
              key={link.path}
              href={link.path}
              className={`
              flex items-center px-4 py-2 rounded-md text-sm font-medium transition
              ${pathname === link.path
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-white/10 hover:text-white"
                }
            `}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* 🔵 MULTI-SECTION DROPDOWNS */}
        {Object.entries(grouped).map(([section, links]) => (
          <div key={section} className="border-t border-white/10 pt-4">

            {/* Section Header */}
            <button
              onClick={() => toggleDropdown(section)}
              className="
              w-full flex justify-between items-center px-4 py-2 text-sm font-semibold
              text-gray-300 hover:text-white transition
            "
            >
              <span>{section}</span>

              {openDropdowns[section] ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Submenu */}
            {openDropdowns[section] && (
              <div className="mt-2 space-y-1 pl-4 border-l border-white/10">
                {links.map(link => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`
                    block px-3 py-2 rounded-md text-sm transition
                    ${pathname === link.path
                        ? "bg-blue-600 text-white shadow"
                        : "hover:bg-white/10 text-gray-300"
                      }
                  `}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );

}
