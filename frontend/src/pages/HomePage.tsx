import { useEffect, useState } from "react";
import HelloApi from "../features/helloWorld/api";

const HomePage = () => {
  const [helloMessage, setHelloMessage] = useState<string | null>(null);
  useEffect(() => {
    const fetchHelloMessage = async () => {
      try {
        const response = await HelloApi();
        setHelloMessage(response.message);
      } catch (error) {
        console.error("Error fetching hello message:", error);
      }
    };

    fetchHelloMessage();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Test API</h1>
      <p className="text-lg">Reçu par l'API : {helloMessage}</p>
    </div>
  );
};

export default HomePage;
