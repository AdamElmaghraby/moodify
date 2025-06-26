import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="border-t backdrop-blur py-4 supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 flex items-center justify-between text-gray-400">
                <p className="text-sm">Made with ♡ by Adam</p>
                <div className="flex space-x-4">
                    <a href="https://github.com/AdamElmaghraby" target="_blank" rel="noopener noreferrer">
                        <FaGithub className="w-5 h-5 hover:text-white-700" />
                    </a>
                    <a href="https://www.linkedin.com/in/adam-elmaghraby/" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className="w-5 h-5 hover:text-white-700" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;