import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Header = () => {

  return (
    <header className="fixed left-1/2 top-4 z-50 -translate-x-1/2 w-full max-w-5xl border-b bg-background/95 backdrop-blur py-2 px-8 rounded-xl shadow-lg supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between gap-8">
      <Link to={"/"}>
        <h4 className="text-2xl font-bold font-mono">moodify.</h4>
      </Link>
      <div className="flex gap-4">
        <Button variant="default">Login</Button>
        {/*<ModeToggle />*/}
      </div>
      </div>
    </header>
  );
};

export default Header;