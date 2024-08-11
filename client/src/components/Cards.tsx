import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardTitle } from "./ui/card";
import { useToast } from "@/components/ui/use-toast";

interface Card {
  id: string;
  question: string;
  answer: string;
}

export const Cards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<Boolean>(false)
  const { toast } = useToast();

  const fetchCards = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/cards`);
      const { data } = response.data;

      if (data.length === 0) {
        toast({
          title: "No cards available",
          description: "There are no cards to display.",
        });
      } else {
        setCards(data);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast({
        title: "Last Card",
        description: "You are on the last card.",
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      toast({
        title: "First Card",
        description: "You are on the first card.",
      });
    }
  };

  if (cards.length === 0) {
    return <div className="text-4xl">No cards yet</div>;
  }

  return (
    <div className="p-4 w-full h-full flex flex-col justify-center items-center ">
      <div className="flex justify-center items-center w-1/2">
        <Card key={cards[currentIndex].id}
          onClick={() => setIsFlipped(!isFlipped)}
          className={`p-4 min-h-48 w-full  bg-gray-950 text-white border-none shadow-sky-900 shadow-sm rounded-xl ${isFlipped ? "animate-hflip" : ""}`}>
          <CardTitle className="text-2xl text-gray-400 text-center">{isFlipped ? "Answer" : "Question"}</CardTitle>
          <CardContent>
            <div className="font-bold text-lg mb-2">{isFlipped ? cards[currentIndex].answer : cards[currentIndex].question}</div>
          </CardContent>
        </Card>
      </div>
      <div className="flex w-1/2 justify-between mt-4">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-gray-800 text-gray-100 hover:text-gray-400 duration-200 rounded"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-gray-800 text-gray-100 hover:text-gray-400 duration-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

