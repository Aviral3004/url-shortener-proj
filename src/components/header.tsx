import { Link, useNavigate, type NavigateFunction } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";

const Header = () => {
  const navigate: NavigateFunction = useNavigate();
  let user = true;
  return (
    <nav className="py-4 flex justify-between items-center">
      <Link to={"/"}>
        <img src="/logo.png" alt="ByteLink logo" className="h-20 rounded-lg" />
      </Link>

      <div>
        {!user ? (
          <Button className="cursor-pointer" onClick={() => navigate("/auth")}>
            Login
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-12 rounded-full">
              <Avatar className="h-12 w-12">
                <AvatarImage src="https://github.com/shadcn.png"/>
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Aviral Kaushal</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex gap-0">
                <LinkIcon className="mr-2 h-4 w-4" />
                My Links
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-0">
                <LogOut className="mr-2 h-4 w-4 text-red-400" />
                <span className="text-red-400">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Header;
