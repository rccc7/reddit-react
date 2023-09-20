import Image from "next/image";
import React, { useState } from "react";
import {
  Bars3Icon,
  HomeIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import {
  BellIcon,
  ChatBubbleLeftEllipsisIcon,
  GlobeAltIcon,
  PlusIcon,
  SparklesIcon,
  SpeakerWaveIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { signIn, useSession, signOut } from "next-auth/react";
import Link from "next/link";

function Header() {
  const { data: session } = useSession();
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(true);
  return (
    <div className="sticky top-0 z-[100] flex-col bg-white px-4 py-2 shadow-sm">
      <div className="flex">
        <div className="relative h-10 w-20 sm:w-24 flex-shrink-0 cursor-pointer">
          <Link href={"/"}>
            <div className="flex flex-row justify-between items-center">
              <Image
                className=""
                src={
                  // "https://upload.wikimedia.org/wikipedia/commons/a/aa/Snoo.svg"
                  "https://upload.wikimedia.org/wikipedia/commons/1/14/Ionicons_logo-reddit.svg"
                }
                // alt="Reddit, Public domain, via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Snoo.svg"
                alt="Reddit, Public domain, via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Ionicons_logo-reddit.svg"
                objectFit="contain"
                width="20px"
                height="40px"
                // layout='fill'
              />
              <Image
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/b/b4/Reddit_logo.svg"
                }
                alt="reddit.com, Public domain, via Wikimedia Commons: "
                objectFit="contain"
                width="55px"
                height="40px"
                // layout='fill'
                // sttribution='https://commons.wikimedia.org/wiki/File:Reddit_logo.svg'
              />
              {/* <h1 className="text-xs sm:text-base font-bold"> -react</h1> */}
            </div>
          </Link>
        </div>
        {/* xl:min-w-[300px]: When we reach the xl screen size, the min width will be 300px */}
        <div className="flex items-center mx-7 xl:min-w-[300px]">
          <HomeIcon className="h-5 w-5" />
          {/* - flex-1 use the majority of space that it has left over 
                - hidden lg:inline: --> By default the text will be hidden that is in the phone,
                and when the viewport width reaches large screen size, 
                then the display of the text will be inline*/}
          <p className="flex-1 ml-2 hidden lg:inline">Home</p>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
        {/* Search field */}
        <form
          className="flex flex-1 items-center space-x-2 rounded-lg border
             border-gray-200 bg-gray-100 px-3 py-1"
        >
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
          <input
            // Occupy the whole space
            className="flex-1 bg-transparent outline-none"
            type="text"
            placeholder="Search Reddit"
          />
          <button hidden />
        </form>
        {/* Since the icons are text we can define their color through text class */}
        {/* hidden lg:inline-flex --> by default hidden and when screen reaches
            the large size then apply flex */}
        <div className="hidden lg:inline-flex items-center mx-5 text-gray-500 space-x-2">
          <SparklesIcon className="icon" />
          <GlobeAltIcon className="icon" />
          <VideoCameraIcon className="icon" />
          <hr className="h-10 border border-gray-100" />
          <ChatBubbleLeftEllipsisIcon className="icon" />
          <BellIcon className="icon" />
          <PlusIcon className="icon" />
          <SpeakerWaveIcon className="icon" />
        </div>
        {/* On large screen hide the menuIcon but make it visible on small screens (in place of icons above) */}
        <div className="ml-5 flex items-center lg:hidden">
          <Bars3Icon className="icon" />
        </div>

        {/* Sing in/ Sign out button */}
        {session ? (
          <div
            className="hidden lg:flex items-center space-x-2 border 
                border-gray-100 p-2 cursor-pointer hover:bg-slate-100"
            onClick={() => signOut()}
          >
            {/* flex-shrink-0: Make sure that this element never shrinks */}
            <div className="relative h-5 w-5 flex-shrink-0">
              <Image
                src={
                  // "https://upload.wikimedia.org/wikipedia/commons/a/aa/Snoo.svg"
                  "https://upload.wikimedia.org/wikipedia/commons/1/14/Ionicons_logo-reddit.svg"
                }
                // alt="Reddit, Public domain, via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Snoo.svg"
                alt="Reddit, Public domain, via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Ionicons_logo-reddit.svg"
                // height={50}
                // width={50}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="flex-1 text-xs">
              {/* here, the truncate classname is used to truncate with "..." when the name is larger */}
              <p className="truncate">{session?.user?.name}</p>
              <p className="text-gray-400">Sign Out</p>
            </div>
            <ChevronDownIcon className="h-5 flex-shrink-0 text-gray-400" />
          </div>
        ) : (
          <div
            className="hidden lg:flex items-center space-x-2 border 
                border-gray-100 p-2 cursor-pointer hover:bg-slate-100"
            onClick={() => signIn()}
          >
            {/* flex-shrink-0: Make sure that this element never shrinks */}
            <div className="relative h-5 w-5 flex-shrink-0">
              <Image
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/a/aa/Snoo.svg"
                }
                alt="Reddit, Public domain, via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Snoo.svg"
                // height={50}
                // width={50}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p className="text-gray-400">Sign In</p>
          </div>
        )}
      </div>
      <div
        className={`bg-yellow-400 text-center rounded-xl p-2 mt-2 ${
          showDisclaimer ? "visible" : "hidden"
        }`}
      >
        <h1 className="pb-2">
          2023 - RCCC 😎 Visit my{" "}
          <a
            className="text-blue-700 underline"
            href="https://rccc-resume1.web.app/"
            target="_blank"
          >
            portfolio page
          </a>
        </h1>
        <h1 className="text-sm">
          <span className="font-bold">IMPORTANT NOTICE:</span> This is a demo
          app that simulates the original Reddit app UI. You can securely sign
          In with your Reddit credentials through Next-auth and Reddit API,
          create posts, comment and vote simulating Reddit functionality. The
          purpose of this app is to demonstrate the reactjs capabilities with
          Nextjs, GraphQL, and Supabase among others. The application will have
          access to your username and display it on the posts or comments you
          make. Reddit logo and icon obtained from wikimedia commons{" "}
          <span className="font-bold">
            THIS IS NOT THE OFFICIAL REDDIT PAGE.
          </span>
        </h1>

        <button
          className="bg-black/20 py-1 px-4 rounded-lg animate-pulse"
          onClick={(e) => setShowDisclaimer(!showDisclaimer)}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Header;
