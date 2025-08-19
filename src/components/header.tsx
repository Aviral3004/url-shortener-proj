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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { HomeIcon, LinkIcon, LogOut, Trash } from "lucide-react";
import { UrlState } from "@/context";
import useFetch from "@/hooks/use-fetch";
import { deleteUserAndResources, logout } from "@/db/apiAuth";
import { BarLoader, BeatLoader } from "react-spinners";
import { useEffect, useRef, useState } from "react";
import ErrorMessage from "./error";

const Header = () => {
  const navigate: NavigateFunction = useNavigate();
  const { user, fetchUser } = UrlState();
  const { loading, fn: fnLogout } = useFetch(logout);
  const {
    loading: loadingDeleteAccount,
    fn: fnDeleteAccount,
    error: deleteErr,
  } = useFetch(deleteUserAndResources, user?.id);

  const deleteAttempted = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (
      deleteAttempted.current &&
      !loadingDeleteAccount &&
      !deleteErr &&
      isOpen
    ) {
      setIsOpen(false);
      setTimeout(async () => {
        await fnLogout().then(() => {
          fetchUser();
          navigate("/");
        });
      }, 300);

      // Reset flag after successful flow
      deleteAttempted.current = false;
    }
  }, [loadingDeleteAccount, deleteErr, isOpen]);

  function getInitials(name: string) {
    if (!name) return "";
    const words = name.trim().split(/\s+/);
    if (words.length == 1) {
      return words[0][0].toUpperCase();
    }
    return words[0][0].toUpperCase() + words[1][0].toUpperCase();
  }

  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link to={"/"}>
          <img
            src="/logo.png"
            alt="ByteLink logo"
            className="h-20 rounded-lg"
          />
        </Link>

        <div>
          {!user ? (
            <Button
              className="cursor-pointer"
              onClick={() => navigate("/auth")}
            >
              Login
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-12 rounded-full">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={user?.user_metadata?.profile_pic}
                    className="object-contain"
                  />
                  <AvatarFallback>
                    {getInitials(user.user_metadata.name)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {user?.user_metadata?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex gap-0" asChild>
                  <Link to={"/"} className="flex gap-0">
                    <HomeIcon className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-0" asChild>
                  <Link to={"/dashboard"} className="flex gap-0">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    My Links
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex gap-0"
                  onClick={() => {
                    fnLogout().then(() => {
                      fetchUser();
                      navigate("/");
                    });
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4 text-red-400" />
                  <span className="text-red-400">Logout</span>
                </DropdownMenuItem>
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="flex gap-0"
                      onSelect={(e) => {
                        e.preventDefault();
                      }}
                      onClick={() => {
                        setIsOpen(true);
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4 text-red-400" />
                      <span className="text-red-400">Delete Account</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                      {deleteErr && (
                        <ErrorMessage message="Failed to delete user account and all resources!" />
                      )}
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        disabled={loadingDeleteAccount ?? false}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <Button
                        onClick={async () => {
                          deleteAttempted.current = true; 
                          await fnDeleteAccount();
                        }}
                        className="bg-white p-2 font-semibold text-sm"
                        disabled={loadingDeleteAccount ?? false}
                      >
                        {loadingDeleteAccount ? (
                          <BeatLoader size={10} color="black" />
                        ) : (
                          "Continue"
                        )}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      {loading && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
    </>
  );
};

export default Header;
