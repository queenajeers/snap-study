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
      <div className="text-center text-gray-500 py-16">
        Loading or no flashcards available...
      </div>
    );
  }

  const getVisibleCards = () => {
    const visible = [];
    const totalCards = flashcards.length;

    for (let i = 0; i < Math.min(4, totalCards); i++) {
      const cardIndex = (currentIndex + i) % totalCards;
      visible.push({
        card: flashcards[cardIndex],
        index: cardIndex,
        stackPosition: i,
      });
    }

    return visible;
  };

  const visibleCards = getVisibleCards();
  const currentCard = flashcards[currentIndex];

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 px-4 pt-4">
      <div className="relative w-full max-w-6xl">
        {[...visibleCards].reverse().map(({ card, index, stackPosition }) => {
          const isTopCard = stackPosition === 0;
          const zIndex = 50 - stackPosition;
          const offset = stackPosition * 5;
          const scale = 1 - stackPosition * 0.03;

          return (
            <div
              key={`${index}-${currentIndex}`}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                isTopCard && isFlying
                  ? "transform translate-y-[-350px] translate-x-[200px] rotate-12 opacity-0"
                  : ""
              }`}
              style={{
                zIndex,
                transform:
                  !isFlying || !isTopCard
                    ? `translateX(${offset}px) translateY(${offset}px) scale(${scale})`
                    : undefined,
                transformOrigin: "center center",
                height: "500px",
              }}
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 ${
                  isTopCard ? "transform-style-preserve-3d" : ""
                } ${isTopCard && showBack && !isFlying ? "rotate-y-180" : ""}`}
                style={{
                  transformStyle: isTopCard ? "preserve-3d" : "flat",
                  perspective: "1000px",
                }}
              >
                {/* Back */}
                <div
                  className={`absolute inset-0 w-full h-full p-12 rounded-2xl shadow-xl ${
                    stackPosition === 0
                      ? "bg-gray-800"
                      : stackPosition === 1
                      ? "bg-gray-700"
                      : "bg-gray-600"
                  } flex items-center justify-center`}
                  style={{
                    backfaceVisibility: isTopCard ? "hidden" : "visible",
                  }}
                >
                  {isTopCard ? (
                    <div className="text-center text-white w-full">
                      <div className="mb-6">
                        <div className="text-sm font-medium text-gray-300 mb-4">
                          Question {index + 1} of {flashcards.length}
                        </div>
                        <div className="text-2xl font-medium leading-relaxed">
                          {card.front}
                        </div>
                      </div>
                      <div className="text-sm text-gray-300">
                        Press Space to see answer
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-white opacity-50">
                      <div className="text-4xl mb-2">📚</div>
                      <div className="text-xs">Card {index + 1}</div>
                    </div>
                  )}
                </div>

                {/* Front */}
                {isTopCard && (
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl shadow-xl bg-white"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    {currentCard.imageUrl ? (
                      <div className="flex h-full">
                        <div className="flex-1 p-8 flex flex-col justify-center">
                          <div className="mb-4">
                            <div className="text-sm font-medium text-gray-500 mb-4">
                              Card {index + 1} of {flashcards.length}
                            </div>

                            <div className="mb-6">
                              <div className="text-sm font-semibold text-blue-600 mb-2">
                                QUESTION
                              </div>
                              <div className="text-lg text-gray-800 font-medium mb-4">
                                {currentCard.front}
                              </div>
                            </div>

                            <div>
                              <div className="text-sm font-semibold text-green-600 mb-2">
                                ANSWER
                              </div>
                              <div className="text-lg text-gray-800">
                                {currentCard.back}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 p-8 flex items-center justify-center bg-gray-50">
                          <img
                            src={currentCard.imageUrl}
                            alt="flashcard visual"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-12 h-full flex flex-col justify-center">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-500 mb-6">
                            Card {index + 1} of {flashcards.length}
                          </div>

                          <div className="mb-8">
                            <div className="text-sm font-semibold text-blue-600 mb-3">
                              QUESTION
                            </div>
                            <div className="text-2xl text-gray-800 font-medium mb-8">
                              {currentCard.front}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-semibold text-green-600 mb-3">
                              ANSWER
                            </div>
                            <div className="text-2xl text-gray-800">
                              {currentCard.back}
                            </div>
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

        {/* Progress Bar */}
        <div className="absolute -bottom-16 left-0 right-0 text-center">
          <div className="inline-flex items-center space-x-4 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <div className="flex space-x-1">
              {flashcards.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? "bg-blue-500"
                      : idx < currentIndex
                      ? "bg-green-400"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {currentIndex + 1} / {flashcards.length}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute -bottom-8 left-0 right-0 text-center">
          <p className="text-gray-600">
            Press{" "}
            <kbd className="px-2 py-1 bg-white rounded shadow text-sm">
              Space
            </kbd>{" "}
            to {showBack ? "continue" : "reveal answer"}
          </p>
        </div>
      </div>

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
