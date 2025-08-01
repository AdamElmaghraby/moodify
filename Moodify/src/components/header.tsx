import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/contexts/auth-context";

const Header = () => {
  const { user, isLoading, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="absolute top-0 left-0 z-50 w-full py-4">
      <div className="container mx-auto px-4 flex h-12 items-center justify-between gap-8">
        <Link to={"/"}>
          <h4 className="text-2xl font-bold font-mono">moodify.</h4>
        </Link>
        <div className="flex gap-4 items-center">
          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-6 min-w-[220px] min-h-12 justify-between cursor-pointer"
                    style={{ minWidth: "220px" }}
                  >
                    {/* Profile Picture on the left */}
                    {user.profilePicture && (
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    {/* Left-aligned text */}
                    <div className="flex-1 flex flex-col items-start justify-center min-w-0">
                      <span className="text-sm font-medium truncate">
                        Logout
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user.username}
                      </span>
                    </div>
                    {/* Logout icon on the right */}
                    <FontAwesomeIcon icon={faSignOutAlt} className="text-lg" />
                  </Button>
                </div>
              ) : (
                <Button variant="default" onClick={login}>
                  Log in
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
