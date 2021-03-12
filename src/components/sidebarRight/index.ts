import appImManager from "../../lib/appManagers/appImManager";
import SidebarSlider from "../slider";
import AppStickersTab from "./tabs/stickers";
import AppPollResultsTab from "./tabs/pollResults";
import AppGifsTab from "./tabs/gifs";
import mediaSizes, { ScreenSize } from "../../helpers/mediaSizes";
import AppPrivateSearchTab from "./tabs/search";
import AppSharedMediaTab from "./tabs/sharedMedia";
import { MOUNT_CLASS_TO } from "../../config/debug";

export const RIGHT_COLUMN_ACTIVE_CLASSNAME = 'is-right-column-shown';

const sharedMediaTab = new AppSharedMediaTab();
const searchTab = new AppPrivateSearchTab();
const stickersTab = new AppStickersTab();
const pollResultsTab = new AppPollResultsTab();

export class AppSidebarRight extends SidebarSlider {
  public static SLIDERITEMSIDS = {
    sharedMedia: 0,
    search: 1,
    stickers: 2,
    pollResults: 3
  };

  public sharedMediaTab: AppSharedMediaTab;
  public searchTab: AppPrivateSearchTab;
  public stickersTab: AppStickersTab;
  public pollResultsTab: AppPollResultsTab;

  constructor() {
    super({
      sidebarEl: document.getElementById('column-right') as HTMLElement,
      tabs: new Map([
        [AppSidebarRight.SLIDERITEMSIDS.sharedMedia, sharedMediaTab],
        [AppSidebarRight.SLIDERITEMSIDS.search, searchTab],
        [AppSidebarRight.SLIDERITEMSIDS.stickers, stickersTab],
        [AppSidebarRight.SLIDERITEMSIDS.pollResults, pollResultsTab]
      ] as any[]), 
      canHideFirst: true,
      navigationType: 'right'
    });

    this.sharedMediaTab = sharedMediaTab;
    this.searchTab = searchTab;
    this.stickersTab = stickersTab;
    this.pollResultsTab = pollResultsTab;

    mediaSizes.addListener('changeScreen', (from, to) => {
      if(to === ScreenSize.medium && from !== ScreenSize.mobile) {
        this.toggleSidebar(false);
      }
    });
  }

  public onCloseTab(id: number, animate: boolean, isNavigation?: boolean) {
    if(!this.historyTabIds.length) {
      this.toggleSidebar(false, animate);
    }

    super.onCloseTab(id, animate, isNavigation);
  }

  /* public selectTab(id: number) {
    const res = super.selectTab(id);

    if(id !== -1) {
      this.toggleSidebar(true);
    }

    return res;
  } */

  public toggleSidebar(enable?: boolean, animate?: boolean) {
    /////this.log('sidebarEl', this.sidebarEl, enable, isElementInViewport(this.sidebarEl));

    const active = document.body.classList.contains(RIGHT_COLUMN_ACTIVE_CLASSNAME);
    let willChange: boolean;
    if(enable !== undefined) {
      if(enable) {
        if(!active) {
          willChange = true;
        }
      } else if(active) {
        willChange = true;
      }
    } else {
      willChange = true;
    }

    if(!willChange) return Promise.resolve();

    if(!active && !this.historyTabIds.length) {
      this.selectTab(AppSidebarRight.SLIDERITEMSIDS.sharedMedia);
    }

    const animationPromise = appImManager.selectTab(active ? 1 : 2, animate);
    document.body.classList.toggle(RIGHT_COLUMN_ACTIVE_CLASSNAME, enable);
    return animationPromise;

    /* return new Promise((resolve, reject) => {
      const hidden: {element: HTMLDivElement, height: number}[] = [];
      const observer = new IntersectionObserver((entries) => {
        for(const entry of entries) {
          const bubble = entry.target as HTMLDivElement;
          if(!entry.isIntersecting) {
            hidden.push({element: bubble, height: bubble.scrollHeight});
          }
        }
  
        for(const item of hidden) {
          item.element.style.minHeight = item.height + 'px';
          (item.element.firstElementChild as HTMLElement).style.display = 'none';
          item.element.style.width = '1px';
        }
  
        //console.log('hidden', hidden);
        observer.disconnect();
  
        set();
  
        setTimeout(() => {
          for(const item of hidden) {
            item.element.style.minHeight = '';
            item.element.style.width = '';
            (item.element.firstElementChild as HTMLElement).style.display = '';
          }

          resolve();
        }, 200);
      });
  
      const length = Object.keys(appImManager.bubbles).length;
      if(length) {
        for(const i in appImManager.bubbles) {
          observer.observe(appImManager.bubbles[i]);
        }
      } else {
        set();
        setTimeout(resolve, 200);
      }
    }); */
  }
}

const appSidebarRight = new AppSidebarRight();
MOUNT_CLASS_TO && (MOUNT_CLASS_TO.appSidebarRight = appSidebarRight);
export default appSidebarRight;
