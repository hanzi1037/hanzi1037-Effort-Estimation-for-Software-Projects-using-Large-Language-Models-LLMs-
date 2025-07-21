import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logoDark from "../assets/images/logo-dark.png";
import logoLight from "../assets/images/logo-light.png";

export default function LandingNavbar() {
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);
  const [scroll, setScroll] = useState<boolean>(false);

  useEffect(() => {

    const handleScroll = () => {
      setScroll(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*********************/
  /*    Menu Active    */
  /*********************/
  function getClosest(elem: HTMLElement | null, selector: string): HTMLElement | null {
    if (!elem) return null;

    if (!Element.prototype.matches) {
      Element.prototype.matches =
        (Element.prototype as any).matchesSelector ||
        (Element.prototype as any).mozMatchesSelector ||
        (Element.prototype as any).msMatchesSelector ||
        (Element.prototype as any).oMatchesSelector ||
        (Element.prototype as any).webkitMatchesSelector ||
        function (this: Element, s: string): boolean {
            const matches = (this.ownerDocument || document).querySelectorAll(s);
            let i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
    }

    while (elem && elem !== document.body) {
      if (elem.matches(selector)) return elem;
      elem = elem.parentElement!;
    }
    return null;
  }

  function activateMenu() {
    const menuItems = document.getElementsByClassName("sub-menu-item") as HTMLCollectionOf<HTMLAnchorElement>;

    let matchingMenuItem: HTMLAnchorElement | null = null;
    for (let idx = 0; idx < menuItems.length; idx++) {
      if (menuItems[idx].href === window.location.href) {
        matchingMenuItem = menuItems[idx];
      }
    }

    if (matchingMenuItem) {
      matchingMenuItem.classList.add("active");

      const immediateParent = getClosest(matchingMenuItem, "li");
      if (immediateParent) {
        immediateParent.classList.add("active");
      }

      let parent = getClosest(immediateParent, ".child-menu-item");
      if (parent) {
        parent.classList.add("active");
      }

      parent = getClosest(parent || immediateParent, ".parent-menu-item");
      if (parent) {
        parent.classList.add("active");

        const parentMenuItem = parent.querySelector(".menu-item");
        if (parentMenuItem) {
          parentMenuItem.classList.add("active");
        }

        const parentOfParent = getClosest(parent, ".parent-parent-menu-item");
        if (parentOfParent) {
          parentOfParent.classList.add("active");
        }
      } else {
        const parentOfParent = getClosest(matchingMenuItem, ".parent-parent-menu-item");
        if (parentOfParent) {
          parentOfParent.classList.add("active");
        }
      }
    }
  }



  return (
    <nav id="topnav" className={`${scroll ? "nav-sticky" : ""} defaultscroll is-sticky`}>
      <div className="container">
        <Link className="logo" to="/">
          <img src={logoDark} className="h-8 inline-block dark:hidden" alt="" />
          <img src={logoLight} className="h-8 hidden dark:inline-block" alt="" />
        </Link>

        <div className="menu-extras">
          <div className="menu-item">
            <button
              className={`${toggleMenu ? "open" : ""} navbar-toggle`}
              onClick={() => setToggleMenu(!toggleMenu)}
            >
              <div className="lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>

        <ul className="buy-button list-none mb-0">
          <li className="inline mb-0">
            <Link to="/login">
              <span className="py-[6px] px-4 md:inline hidden items-center justify-center tracking-wider align-middle duration-500 text-sm text-center rounded bg-amber-400/5 hover:bg-amber-400 border border-amber-400/10 hover:border-amber-400 text-amber-400 hover:text-white font-semibold">
                Login
              </span>
              <span className="py-[6px] px-4 inline md:hidden items-center justify-center tracking-wider align-middle duration-500 text-sm text-center rounded bg-amber-400 hover:bg-amber-500 border border-amber-400 hover:border-amber-500 text-white font-semibold">
                Login
              </span>
            </Link>
          </li>

          <li className="md:inline hidden ps-1 mb-0">
            <Link
              to="/signup"
              target="_blank"
              className="py-[6px] px-4 inline-block items-center justify-center tracking-wider align-middle duration-500 text-sm text-center rounded bg-amber-400 hover:bg-amber-500 border border-amber-400 hover:border-amber-500 text-white font-semibold"
            >
              Signup
            </Link>
          </li>
        </ul>

        <div id="navigation" className={`${toggleMenu ? "block" : ""}`}>
          <ul className="navigation-menu">
            <li>
              <Link to="/" className="sub-menu-item">
                Home
              </Link>
            </li>
            <li>
              <a href="#aboutus" className="sub-menu-item">About</a>
            </li>
            <li>
              <a href="#features" className="sub-menu-item">Features</a>
            </li>
            <li>
              <a href="#connect" className="sub-menu-item">Connect</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
