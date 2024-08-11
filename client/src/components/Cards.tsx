import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "./ui/card";
import { useToast } from "@/components/ui/use-toast";

interface Card {
  id: string;
  question: string;
  answer: string;
}

export const Cards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
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
    fetchCards(); // Fetch all cards on component mount
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
    <div className="p-4">
      <div className="flex justify-center">
        <Card key={cards[currentIndex].id} className="p-4 border rounded shadow-sm">
          <CardContent>
            <div className="font-bold text-lg mb-2">{cards[currentIndex].question}</div>
            <div>{cards[currentIndex].answer}</div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

