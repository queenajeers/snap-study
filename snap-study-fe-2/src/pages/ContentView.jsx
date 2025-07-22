import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebaseInit";
import { useAuth } from "../contexts/AuthContext";

export default function ContentView() {
  const { id, contentId } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const contentRef = ref(
      database,
      `users/${user.uid}/projects/${id}/contents/${contentId}`
    );

    const unsubscribe = onValue(contentRef, (snapshot) => {
      const contentData = snapshot.val();
      if (contentData?.flashcards) {
        const cards = Object.values(contentData.flashcards);
        setFlashcards(cards);
      }
    });

    return () => unsubscribe();
  }, [id, contentId, user]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (isFlying) return;

        if (!showBack) {
          setShowBack(true);
        } else {
          setIsFlying(true);
          setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % flashcards.length);
            setShowBack(false);
            setIsFlying(false);
          }, 600);
        }
      }
    },
    [showBack, flashcards.length, isFlying]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!user || flashcards.length === 0) {
    return (
      <div className="text-center text-neutral-500 py-16 text-sm">
        Loading or no flashcards available...
      </div>
    );
  }

  const getVisibleCards = () => {
    const visible = [];
    const total = flashcards.length;
    for (let i = 0; i < Math.min(4, total); i++) {
      const idx = (currentIndex + i) % total;
      visible.push({
        card: flashcards[idx],
        index: idx,
        stackPosition: i,
      });
    }
    return visible;
  };

  const visibleCards = getVisibleCards();
  const currentCard = flashcards[currentIndex];

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-100 px-4 pt-8 select-none relative">
      <div className="relative w-full max-w-5xl h-[500px]">
        {visibleCards
          .slice()
          .reverse()
          .map(({ card, index, stackPosition }) => {
            const isTop = stackPosition === 0;
            const zIndex = 50 - stackPosition;
            const offset = stackPosition * 6;
            const scale = 1 - stackPosition * 0.03;

            return (
              <div
                key={`${index}-${currentIndex}`}
                className={`absolute inset-0 transition-all duration-700 ${
                  isTop && isFlying
                    ? "transform translate-y-[-300px] translate-x-[150px] rotate-12 opacity-0"
                    : ""
                }`}
                style={{
                  zIndex,
                  transform:
                    !isFlying || !isTop
                      ? `translateX(${offset}px) translateY(${offset}px) scale(${scale})`
                      : undefined,
                  transformOrigin: "center",
                }}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-500 ${
                    isTop ? "transform-style-preserve-3d" : ""
                  } ${isTop && showBack && !isFlying ? "rotate-y-180" : ""}`}
                  style={{
                    transformStyle: isTop ? "preserve-3d" : "flat",
                    perspective: "1000px",
                  }}
                >
                  {/* Back of card */}
                  <div
                    className={`absolute inset-0 w-full h-full p-10 rounded-xl flex items-center justify-center ${
                      stackPosition === 0
                        ? "bg-neutral-800 text-white"
                        : stackPosition === 1
                        ? "bg-neutral-700 text-white"
                        : "bg-neutral-600 text-white"
                    }`}
                    style={{
                      backfaceVisibility: isTop ? "hidden" : "visible",
                    }}
                  >
                    {isTop ? (
                      <div className="text-center w-full">
                        <div className="text-xs text-neutral-400 mb-3">
                          Question {index + 1} of {flashcards.length}
                        </div>
                        <div className="text-xl font-medium mb-6">
                          {card.front}
                        </div>
                        <div className="text-xs text-neutral-400">
                          Press{" "}
                          <kbd className="bg-white px-1 py-0.5 rounded text-black text-xs">
                            Space
                          </kbd>{" "}
                          to view answer
                        </div>
                      </div>
                    ) : (
                      <div className="text-center opacity-40 text-sm">
                        <div className="text-3xl mb-2">📘</div>
                        Card {index + 1}
                      </div>
                    )}
                  </div>

                  {/* Front (answer) */}
                  {isTop && (
                    <div
                      className="absolute inset-0 w-full h-full bg-white rounded-xl p-10"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      {currentCard.imageUrl ? (
                        <div className="flex h-full">
                          <div className="flex-1 flex flex-col justify-center pr-6">
                            <div className="text-xs text-neutral-400 mb-2">
                              Card {index + 1} of {flashcards.length}
                            </div>

                            <div className="mb-4">
                              <div className="text-xs text-neutral-500 mb-1">
                                QUESTION
                              </div>
                              <div className="text-lg text-neutral-800 font-medium">
                                {currentCard.front}
                              </div>
                            </div>

                            <div>
                              <div className="text-xs text-neutral-500 mb-1">
                                ANSWER
                              </div>
                              <div className="text-lg text-neutral-800">
                                {currentCard.back}
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 flex items-center justify-center bg-neutral-100 rounded-lg">
                            <img
                              src={currentCard.imageUrl}
                              alt="card"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col justify-center text-center">
                          <div className="text-xs text-neutral-400 mb-4">
                            Card {index + 1} of {flashcards.length}
                          </div>

                          <div className="mb-6">
                            <div className="text-xs text-neutral-500 mb-1">
                              QUESTION
                            </div>
                            <div className="text-xl text-neutral-800 font-medium">
                              {currentCard.front}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs text-neutral-500 mb-1">
                              ANSWER
                            </div>
                            <div className="text-xl text-neutral-800">
                              {currentCard.back}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        {/* Progress */}
        <div className="absolute -bottom-14 left-0 right-0 flex flex-col items-center gap-1">
          <div className="flex gap-1">
            {flashcards.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === currentIndex
                    ? "bg-neutral-900"
                    : idx < currentIndex
                    ? "bg-neutral-400"
                    : "bg-neutral-300"
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-neutral-500">
            {currentIndex + 1} / {flashcards.length}
          </div>
        </div>

        {/* Instruction */}
        <div className="absolute -bottom-4 left-0 right-0 text-center text-xs text-neutral-500">
          Press{" "}
          <kbd className="bg-white px-1 py-0.5 rounded text-black text-xs">
            Space
          </kbd>{" "}
          to {showBack ? "continue" : "reveal answer"}
        </div>
      </div>

      {/* Interaction lock */}
      {isFlying && (
        <div className="absolute inset-0 bg-transparent z-50 pointer-events-auto" />
      )}

      {/* Custom styles */}
      <style jsx>{`
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
