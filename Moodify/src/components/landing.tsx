import { BlurFade } from "@/components/magicui/blur-fade";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { ShimmerButton } from "./magicui/shimmer-button";
// import Background from "./background";
import Header from "./header";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { BackgroundBeams } from "./ui/background-beams";

const Landing = () => {
  const { user, login } = useAuth();

  const handleButtonClick = () => {
    if (user) {
      // User is logged in, navigate to main app or chat page
      window.location.href = "/chat";
    } else {
      // User is not logged in, trigger login
      login();
    }
  };

  return (
    <div>
      <BackgroundBeams />
      {/* <Background paused={paused} /> */}
      <Header />
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-5">
        <BlurFade direction="up" duration={0.6} delay={0.25} inView>
          <h3
            className="text-6xl mb-4 font-semibold text-center"
            style={{ lineHeight: "70px" }}
          >
            Turn Your Mood <br />
            Into Music with AI
          </h3>
        </BlurFade>
        <BlurFade direction="up" duration={0.8} delay={0.75} inView>
          <h2 className="text-1xl text-center">
            Instantly generate Spotify playlists from a simple vibe or feeling.{" "}
            <br /> Powered by AI — personalized just for you.
          </h2>
        </BlurFade>
        {/* 
        <BlurFade direction="up" duration={0.6} delay={0.95} inView>
          <Button variant="secondary" size="lg">
            <FontAwesomeIcon icon={faSpotify} />
            Login with Spotify
          </Button>
        </BlurFade>
        */}

        <BlurFade direction="up" duration={0.6} delay={0.95} inView>
          <ShimmerButton
            className="shadow-4xl bg-transparent border border-gray-300"
            shimmerColor="#1ED760"
            shimmerSize=".15em"
            borderRadius="50px"
            onClick={handleButtonClick}
          >
            {user ? (
              <>
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                  Get Started
                </span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSpotify} color="white" />
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                  {"    "}Login with Spotify
                </span>
              </>
            )}
          </ShimmerButton>
        </BlurFade>
      </div>
    </div>
  );
};

export default Landing;
