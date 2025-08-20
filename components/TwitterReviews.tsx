'use client';

import React, { useEffect, useRef } from 'react';
import styles from '../app/twitter-reviews.module.css';

interface Tweet {
  id: number;
  href: string;
  avatar: string;
  name: string;
  username: string;
  content: string;
  time: string;
  views: string;
  verified?: boolean;
  hasASvg?: boolean;
}

const tweets: Tweet[] = [
  {
    id: 0,
    href: "https://x.com/kriissaa_krae/status/1913373185619247501?s=46&t=OTgvaY8pDSn4kLwnkChHdA",
    avatar: "/avatar-0.jpeg",
    name: "🅺🆁🅸🆂🆂 🅺🆁🆈",
    username: "@kriissaa_krae",
    content: "Dear people who are using dating apps to cheat on their SOs…\n\nYou will be found out so don't be scumbags and cheat.",
    time: "4:24 PM · Apr 18, 2025",
    views: "439",
    verified: true,
    hasASvg: true
  },
  {
    id: 1,
    href: "https://x.com/richyrich323/status/1866259978736345457",
    avatar: "/avatar-1.jpeg",
    name: "Sheree's Stolen Joggers",
    username: "@richyrich323",
    content: "Not the Cheaterbuster profile",
    time: "5:13 PM · Dec 9, 2024",
    views: "1,368",
    verified: true
  },
  {
    id: 2,
    href: "https://x.com/JaneValkering/status/1626595726569635840",
    avatar: "/avatar-2.jpeg",
    name: "Jane Valkering",
    username: "@JaneValkering",
    content: "Cheaterbuster the best app so far. You can find every cheater that's on tinder",
    time: "8:53 AM · Feb 17, 2023",
    views: "2,230"
  },
  {
    id: 3,
    href: "http://x.com/kaestigo/status/1826726572222808230",
    avatar: "/avatar-3.jpeg",
    name: "kaekae - i'm going places,...",
    username: "@kaestigo",
    content: "The AI Cheaterbuster shit works...",
    time: "3:02 PM · Aug 22, 2024",
    views: "601"
  },
  {
    id: 4,
    href: "https://x.com/zacritic/status/1846267484930035846",
    avatar: "/avatar-4.jpeg",
    name: "Magnar",
    username: "@zacritic",
    content: "Cheaterbuster AI app IYKYK",
    time: "1:10 PM · Oct 15, 2024",
    views: "183"
  },
  {
    id: 5,
    href: "https://x.com/emilyhxrrera/status/1825871427095973919",
    avatar: "/avatar-5.jpeg",
    name: "em herrera 🌃",
    username: "@emilyhxrrera",
    content: "How are we not talking about Cheaterbuster.ai?",
    time: "6:24 AM · Aug 20, 2024",
    views: "1,980",
    verified: true
  },
  {
    id: 6,
    href: "https://x.com/snoruntt/status/1875638997265084480",
    avatar: "/avatar-6.jpeg",
    name: "matt",
    username: "@snoruntt",
    content: "Oomf found his man was cheating from Cheaterbuster.ai? 🙁",
    time: "2:22 PM · Jan 4, 2025",
    views: "3,415"
  },
  {
    id: 7,
    href: "https://x.com/EloAng1/status/1849104785909178684",
    avatar: "/avatar-7.jpeg",
    name: "BlackAngel",
    username: "@EloAng1",
    content: "and here is another way to find if women cheat on you Cheaterbuster.ai?",
    time: "9:05 AM · Oct 23, 2024",
    views: "350",
    verified: true
  },
  {
    id: 8,
    href: "https://x.com/erv78/status/1866269258595840063",
    avatar: "/avatar-8.jpeg",
    name: "Erv",
    username: "@erv78",
    content: "It's easy with the cheaterbuster AI app. It literally takes your profile pics from IG and FB then scans through all dating apps to find any of those pics there....",
    time: "5:50 PM · Dec 9, 2024",
    views: "150"
  }
];

const TwitterReviews: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const handleTweetClick = (href: string) => {
    window.open(href, '_blank');
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollPosition = 0;
    const scrollSpeed = 1; // pixels per frame
    const scrollDelay = 50; // milliseconds between scrolls

    const autoScroll = () => {
      if (!container) return;

      scrollPosition += scrollSpeed;
      
      // If we've scrolled to the end, reset to beginning
      if (scrollPosition >= container.scrollWidth - container.clientWidth) {
        scrollPosition = 0;
      }

      container.scrollLeft = scrollPosition;
      animationRef.current = requestAnimationFrame(autoScroll);
    };

    // Start auto-scrolling after a delay
    const startDelay = setTimeout(() => {
      animationRef.current = requestAnimationFrame(autoScroll);
    }, 2000);

    // Pause on hover
    const handleMouseEnter = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };

    const handleMouseLeave = () => {
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(autoScroll);
      }
    };

    // Pause on touch
    const handleTouchStart = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };

    const handleTouchEnd = () => {
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(autoScroll);
      }
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      clearTimeout(startDelay);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className={styles.twitterContainer} ref={containerRef}>
      <p className={`${styles.title} ${styles.fwBold}`}>
        THE AI YOU'VE SEEN 💥EVERYWHERE💥
      </p>
      
      <div className={styles.tweetsContainer} ref={scrollRef}>
        {tweets.map((tweet) => (
          <div
            key={tweet.id}
            className={styles.tweet}
            onClick={() => handleTweetClick(tweet.href)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleTweetClick(tweet.href);
              }
            }}
          >
            <div className={styles.tweetHeader}>
              <img src={tweet.avatar} alt={`${tweet.name} avatar`} />
              <p className={styles.fw600}>
                {tweet.name}
                {tweet.hasASvg && <span className={styles.aSvg}></span>}
                {tweet.verified && <span className={styles.verified}></span>}
                <span className={styles.needle}>{tweet.username}</span>
              </p>
            </div>
            
            <div className={styles.tweetContent}>
              {tweet.content.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  <span style={{ display: 'block', marginBottom: '0.5em' }}>
                    {line}
                  </span>
                </React.Fragment>
              ))}
            </div>
            
            <div className={styles.tweetFooter}>
              {tweet.time} · <span className={`${styles.fwBold} ${styles.textWhite}`}>{tweet.views}</span> Views
            </div>
            <hr />
          </div>
        ))}
      </div>
      
      <div className={styles.trustpilot}>
        4.7 <span></span>Trustpilot
      </div>
    </div>
  );
};

export default TwitterReviews;
