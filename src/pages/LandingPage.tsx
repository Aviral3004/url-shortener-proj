import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState<string>("");
  const navigate = useNavigate();

  const handleShorten = (e: React.FormEvent): void => {
    e.preventDefault();
    if (longUrl) {
      navigate(`/auth/?createNew=${longUrl}`);
    }
  };
  return (
    <div className="flex flex-col items-center">
      <h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold">
        The only URL Shortener
        <br /> you'll ever need! 👇
      </h2>
      <form
        onSubmit={handleShorten}
        className="sm:h-14 flex flex-col sm:flex-row w-[90vw] md:w-1/2 gap-2"
      >
        <Input
          type="url"
          placeholder="Enter you looong url"
          className="h-full flex-1 py-4 px-4"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />
        <Button className="h-full" type="submit" variant={"destructive"}>
          Shorten!
        </Button>
      </form>
      <Accordion type="multiple" className="w-full md:p-11">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is ByteLink?</AccordionTrigger>
          <AccordionContent>
            ByteLink is a fast and reliable URL shortener that helps you convert
            long and complex web addresses into short, easy-to-share links.
            Whether you're sharing on social media, emails, or messaging apps,
            ByteLink makes your URLs cleaner and more user-friendly.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How Does ByteLink Work?</AccordionTrigger>
          <AccordionContent>
            Simply paste your long URL into the ByteLink input box and click the
            “Shorten” button. ByteLink instantly generates a unique short link
            that redirects users to your original URL. Track clicks and analyze
            link performance with our integrated analytics dashboard.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Why Choose ByteLink?</AccordionTrigger>
          <AccordionContent>
            <ul
              className="flex flex-col gap-3"
              style={{ listStyleType: "disc", paddingLeft: "20px" }}
            >
              <li>
                <h1 className="text-md font-bold"> Customizable Links:</h1>
                <p>
                  Personalize your short URLs for better branding. Analytics:
                  Monitor your link performance with detailed click reports.{" "}
                </p>
              </li>
              <li>
                <h1 className="text-md font-bold">Secure & Reliable:</h1>
                <p>
                  ByteLink ensures your links are safe and always accessible.
                </p>
              </li>
              <li>
                <h1 className="text-md font-bold"> Free & Easy to Use:</h1>
                <p>No sign-up needed—start shortening links right away!</p>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LandingPage;
