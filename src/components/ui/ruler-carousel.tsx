"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Rewind, FastForward } from "lucide-react";

export interface CarouselItem {
  id: number;
  title: string;
}

type InfiniteCarouselItem = {
  id: string;
  title: string;
  originalIndex: number;
};

const createInfiniteItems = (originalItems: CarouselItem[]): InfiniteCarouselItem[] => {
  const items: InfiniteCarouselItem[] = [];
  for (let i = 0; i < 3; i++) {
    originalItems.forEach((item, index) => {
      items.push({
        ...item,
        id: `${i}-${item.id}`,
        originalIndex: index,
      });
    });
  }
  return items;
};

const RulerLines = ({
  top = true,
  totalLines = 100,
}: {
  top?: boolean;
  totalLines?: number;
}) => {
  const lines = [];
  const lineSpacing = 100 / (totalLines - 1);

  for (let i = 0; i < totalLines; i++) {
    const isFifth = i % 5 === 0;
    const isCenter = i === Math.floor(totalLines / 2);

    let height = "h-3";
    let color = "bg-gray-500 dark:bg-gray-400";

    if (isCenter) {
      height = "h-8";
      color = "bg-[var(--primary)] dark:bg-white";
    } else if (isFifth) {
      height = "h-4";
      color = "bg-[var(--primary)] dark:bg-white";
    }

    const positionClass = top ? "" : "bottom-0";

    lines.push(
      <div
        key={i}
        className={`absolute w-0.5 ${height} ${color} ${positionClass}`}
        style={{ left: `${i * lineSpacing}%` }}
      />
    );
  }

  return <div className="relative h-8 w-full px-4">{lines}</div>;
};

export function RulerCarousel({
  originalItems,
}: {
  originalItems: CarouselItem[];
}) {
  const infiniteItems = createInfiniteItems(originalItems);
  const itemsPerSet = originalItems.length;

  const initialIndex = itemsPerSet + Math.min(4, Math.max(0, itemsPerSet - 1));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isResetting, setIsResetting] = useState(false);
  const [rotatingCards, setRotatingCards] = useState<number[]>([]);
  const previousIndexRef = useRef(initialIndex);

  const handleItemClick = (newIndex: number) => {
    if (isResetting) return;

    const targetOriginalIndex = newIndex % itemsPerSet;
    const possibleIndices = [
      targetOriginalIndex,
      targetOriginalIndex + itemsPerSet,
      targetOriginalIndex + itemsPerSet * 2,
    ];

    let closestIndex = possibleIndices[0];
    let smallestDistance = Math.abs(possibleIndices[0] - activeIndex);

    for (const index of possibleIndices) {
      const distance = Math.abs(index - activeIndex);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    }

    previousIndexRef.current = activeIndex;
    setActiveIndex(closestIndex);
  };

  const handlePrevious = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingCards((prev) => prev.map((_, i) => (prev[i] + 0.5) % 360));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setRotatingCards(originalItems.map((_, i) => i * (360 / Math.max(1, originalItems.length))));
  }, [originalItems]);

  useEffect(() => {
    if (isResetting) return;

    if (activeIndex < itemsPerSet) {
      setIsResetting(true);
      setTimeout(() => {
        setActiveIndex(activeIndex + itemsPerSet);
        setIsResetting(false);
      }, 0);
    } else if (activeIndex >= itemsPerSet * 2) {
      setIsResetting(true);
      setTimeout(() => {
        setActiveIndex(activeIndex - itemsPerSet);
        setIsResetting(false);
      }, 0);
    }
  }, [activeIndex, itemsPerSet, isResetting]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isResetting) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((prev) => prev - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isResetting]);

  const centerPosition = 5;
  const targetX = -500 + (centerPosition - (activeIndex % itemsPerSet)) * 500;
  const currentPage = (activeIndex % itemsPerSet) + 1;
  const totalPages = itemsPerSet;

  return (
    <div className="flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden bg-white">
      <div className="relative flex h-[220px] w-full max-w-[1400px] flex-col justify-center px-4 md:h-[240px]">
        <div className="flex items-center justify-center">
          <RulerLines top />
        </div>
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <motion.div
            className="flex items-center gap-[100px]"
            animate={{
              x: isResetting ? targetX : targetX,
            }}
            transition={
              isResetting
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    mass: 1,
                  }
            }
          >
            {infiniteItems.map((item, index) => {
              const isActive = index === activeIndex;
              const cardRotation = rotatingCards[item.originalIndex] ?? 0;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleItemClick(index)}
                  className={`flex w-[400px] cursor-pointer items-center justify-center whitespace-nowrap text-4xl font-bold md:text-6xl ${
                    isActive
                      ? "text-[var(--primary)]"
                      : "text-neutral-400 hover:text-neutral-700"
                  }`}
                  animate={{
                    scale: isActive ? 1 : 0.75,
                    opacity: isActive ? 1 : 0.4,
                    rotateZ: isActive ? 0 : Math.sin(cardRotation * (Math.PI / 180)) * 1.5,
                  }}
                  transition={
                    isResetting
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }
                  }
                >
                  {item.title}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
        <div className="flex items-center justify-center">
          <RulerLines top={false} />
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={isResetting}
          className="flex cursor-pointer items-center justify-center"
          aria-label="Previous item"
        >
          <Rewind className="h-5 w-5 text-[var(--primary)]/80" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-600">
            {currentPage}
          </span>
          <span className="text-sm text-neutral-500">/</span>
          <span className="text-sm font-medium text-neutral-600">
            {totalPages}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={isResetting}
          className="flex cursor-pointer items-center justify-center"
          aria-label="Next item"
        >
          <FastForward className="h-5 w-5 text-[var(--primary)]/80" />
        </button>
      </div>
    </div>
  );
}
