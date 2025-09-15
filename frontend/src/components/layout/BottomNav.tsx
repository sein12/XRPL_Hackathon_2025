import { NavLink } from "react-router-dom";
import { Home, Package, FileText, ClipboardList, User } from "lucide-react"; // lucide-react 아이콘

interface Item {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const items: Item[] = [
  { to: "/dashboard", icon: <Home size={20} />, label: "홈" },
  { to: "/dashboard/products", icon: <Package size={20} />, label: "상품" },
  {
    to: "/dashboard/contracts",
    icon: <FileText size={20} />,
    label: "내 계약",
  },
  { to: "/dashboard/claims", icon: <ClipboardList size={20} />, label: "청구" },
  { to: "/dashboard/profile", icon: <User size={20} />, label: "프로필" },
];

export default function BottomNav() {
  return (
    <nav className="flex justify-between items-center border-t bg-white px-4 py-2">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs font-medium transition-colors ${
              isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
