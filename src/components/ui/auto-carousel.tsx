
import React, { useRef, useEffect, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AutoCarouselProps {
  children: ReactNode;
  speed?: number; // pixels per second
  direction?: "left" | "right";
  className?: string;
  pauseOnHover?: boolean;
  fadeEdges?: boolean;
}

export const AutoCarousel = ({
  children,
  speed = 40,
  direction = "left",
  className,
  pauseOnHover = true,
  fadeEdges = true,
}: AutoCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [contentDuplicated, setContentDuplicated] = useState(false);

  useEffect(() => {
    if (!scrollerRef.current || contentDuplicated) return;
    
    // Clone the content to create the infinite effect
    const content = scrollerRef.current;
    const clone = content.cloneNode(true) as HTMLElement;
    content.parentNode?.appendChild(clone);
    setContentDuplicated(true);
  }, [contentDuplicated]);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;
    
    const container = containerRef.current;
    const contentWidth = scrollerRef.current.offsetWidth;
    
    let animationFrame: number;
    let lastTime = performance.now();
    let currentPosition = 0;
    
    const animate = (time: number) => {
      if (isPaused) {
        lastTime = time;
        animationFrame = requestAnimationFrame(animate);
        return;
      }
      
      const deltaTime = time - lastTime;
      const pixelsToMove = (speed * deltaTime) / 1000;
      
      lastTime = time;
      
      // Update position based on direction
      if (direction === "left") {
        currentPosition -= pixelsToMove;
        if (currentPosition <= -contentWidth) {
          currentPosition += contentWidth;
        }
      } else {
        currentPosition += pixelsToMove;
        if (currentPosition >= contentWidth) {
          currentPosition -= contentWidth;
        }
      }
      
      if (scrollerRef.current) {
        scrollerRef.current.style.transform = `translateX(${currentPosition}px)`;
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [speed, direction, isPaused]);

  return (
    <div 
      className={cn(
        "relative overflow-hidden", 
        fadeEdges && "after:absolute after:right-0 after:top-0 after:h-full after:w-16 after:bg-gradient-to-l after:from-white after:to-transparent before:absolute before:left-0 before:top-0 before:h-full before:w-16 before:bg-gradient-to-r before:from-white before:to-transparent before:z-10 after:z-10",
        className
      )}
      ref={containerRef}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      onTouchStart={() => pauseOnHover && setIsPaused(true)}
      onTouchEnd={() => pauseOnHover && setIsPaused(false)}
    >
      <div 
        className="flex"
        ref={scrollerRef}
        style={{ 
          willChange: "transform",
          transform: "translateX(0px)",
        }}
      >
        {children}
      </div>
    </div>
  );
};
