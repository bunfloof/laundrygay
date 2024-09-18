import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { SiTypescript } from "react-icons/si";
import { FaRust } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import MeasurePing from './MeasurePing';

interface AboutDialogProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AboutDialog: React.FC<AboutDialogProps> = ({ children, isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="py-5">
          <div className='text-center flex flex-col items-center pb-10'>
            <h1 className='font-light text-3xl mb-2 mt-8'>About LaundryFurry</h1>
            <div className='text-muted-foreground text-xs mb-2'>
              2024 by {' '}
              <a className="text-blue-500 hover:text-blue-600 transition-all" href='http://foxomy.com/'>Công ty TNHH Foxomy</a>. All Rights
              Reserved.
            </div>
            <span className="text-black dark:text-white">
              <svg width="200" height="26" viewBox="0 0 180 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="157" width="23" height="23" fill="#DA0021"/>
                <path className="fill-current" d="M1.07422 8L3.57422 15.0508H3.64453L6.14453 8H6.91016L4 16H3.21875L0.308594 8H1.07422ZM13.9617 8V16H13.2312V8H13.9617ZM21.0387 16V8H25.6793V8.65625H21.7691V11.668H25.4332V12.3242H21.7691V15.3437H25.7574V16H21.0387ZM32.0355 8.65625V8H37.8363V8.65625H35.3012V16H34.5707V8.65625H32.0355ZM58.7051 8V16H57.9941L53.2676 9.30078H53.2051V16H52.4746V8H53.1816L57.9238 14.707H57.9863V8H58.7051ZM65.7937 16H65.0281L67.9383 8H68.7195L71.6297 16H70.8641L68.3562 8.94922H68.3016L65.7937 16ZM66.3445 12.9336H70.3133V13.5898H66.3445V12.9336ZM77.9508 8H78.7945L81.6969 14.9688H81.7672L84.6695 8H85.5133V16H84.8258V9.54297H84.7633L82.0641 16H81.4L78.7008 9.54297H78.6383V16H77.9508V8ZM100.634 8H101.478L104.38 14.9688H104.45L107.353 8H108.196V16H107.509V9.54297H107.446L104.747 16H104.083L101.384 9.54297H101.321V16H100.634V8ZM115.285 16H114.52L117.43 8H118.211L121.121 16H120.355L117.848 8.94922H117.793L115.285 16ZM115.836 12.9336H119.805V13.5898H115.836V12.9336ZM129.786 16H127.442V8H129.927C130.69 8 131.342 8.15885 131.884 8.47656C132.428 8.79427 132.845 9.25 133.134 9.84375C133.423 10.4375 133.567 11.1497 133.567 11.9805C133.567 12.819 133.419 13.5391 133.122 14.1406C132.828 14.7396 132.398 15.1992 131.833 15.5195C131.27 15.8398 130.588 16 129.786 16ZM128.173 15.3437H129.743C130.43 15.3437 131.006 15.2083 131.47 14.9375C131.933 14.6667 132.281 14.2799 132.512 13.7773C132.744 13.2747 132.86 12.6758 132.86 11.9805C132.858 11.2904 132.743 10.6966 132.516 10.1992C132.292 9.70182 131.959 9.32031 131.516 9.05469C131.076 8.78906 130.532 8.65625 129.884 8.65625H128.173V15.3437ZM140.288 16V8H144.928V8.65625H141.018V11.668H144.682V12.3242H141.018V15.3437H145.006V16H140.288Z"/>
                <path d="M168.5 2L170.857 9.25532H178.486L172.314 13.7394L174.672 20.9947L168.5 16.5106L162.328 20.9947L164.686 13.7394L158.514 9.25532H166.143L168.5 2Z" fill="#FFEA00"/>
              </svg>
            </span>
          </div>
          <div className='text-muted-foreground px-5 text-xs'>Hosted in Vietnam</div>
          <div className='text-muted-foreground px-5 text-xs'>Version: 2.0.3</div>
          <div className='text-muted-foreground px-5 text-xs'>Ping: <MeasurePing /></div>
          <p className="text-sm px-5 p-2"> Our code is open source below:</p>
          <div className="px-5">
          <Link 
            href="https://gitee.com/furryasshax/laundryfurry/"
            passHref
            legacyBehavior
            >
            <a 
                className="group block bg-secondary/80 hover:bg-secondary/70 border border-secondary/20 rounded-lg shadow-sm overflow-hidden transition-all duration-200 relative"
                target="_blank"
                rel="noopener noreferrer"
            >
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:translate-y-1/6 group-hover:scale-110 transition-all duration-200">
                <SiTypescript className="w-28 h-28 text-foreground" />
                </div>
                <div className="p-4 flex items-start relative z-10">
                <div className="flex-grow">
                    <h3 className="text-md font-semibold mb-1 text-foreground">LaundryFurry</h3>
                    <p className="text-sm text-foreground/80">Eat the rich ☭</p>
                </div>
                <ExternalLink className="w-5 h-5 text-foreground/50 group-hover:text-foreground transition-colors duration-200 ml-2 mt-1" />
                </div>
                <div className="h-1 bg-gradient-to-r from-sky-600 to-sky-600/40"></div>
            </a>
            </Link>

            <Link 
            href="https://gitee.com/furryasshax/laundryserver/"
            passHref
            legacyBehavior
            >
            <a 
                className="mt-4 group block bg-secondary/80 hover:bg-secondary/70 border border-secondary/20 rounded-lg shadow-sm overflow-hidden transition-all duration-200 relative"
                target="_blank"
                rel="noopener noreferrer"
            >
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:translate-y-1/6 group-hover:scale-110 transition-all duration-200">
                <FaRust className="w-28 h-28 text-foreground" />
                </div>
                <div className="p-4 flex items-start relative z-10">
                <div className="flex-grow">
                    <h3 className="text-md font-semibold mb-1 text-foreground">LaundryServer</h3>
                    <p className="text-sm text-foreground/80">Feed the poor ☭</p>
                </div>
                <ExternalLink className="w-5 h-5 text-foreground/50 group-hover:text-foreground transition-colors duration-200 ml-2 mt-1" />
                </div>
                <div className="h-1 bg-gradient-to-r from-orange-600 to-orange-600/40"></div>
            </a>
            </Link>
            
            <Link 
            href="https://gitee.com/furryasshax/laundryinfector/"
            passHref
            legacyBehavior
            >
            <a 
                className="mt-4 group block bg-secondary/80 hover:bg-secondary/70 border border-secondary/20 rounded-lg shadow-sm overflow-hidden transition-all duration-200 relative"
                target="_blank"
                rel="noopener noreferrer"
            >
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:translate-y-1/6 group-hover:scale-110 transition-all duration-200">
                <FaRust className="w-28 h-28 text-foreground" />
                </div>
                <div className="p-4 flex items-start relative z-10">
                <div className="flex-grow">
                    <h3 className="text-md font-semibold mb-1 text-foreground">LaundryInfector</h3>
                    <p className="text-sm text-foreground/80">A cute furry latex infection for brightai</p>
                </div>
                <ExternalLink className="w-5 h-5 text-foreground/50 group-hover:text-foreground transition-colors duration-200 ml-2 mt-1" />
                </div>
                <div className="h-1 bg-gradient-to-r from-orange-600 to-orange-600/40"></div>
            </a>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutDialog;