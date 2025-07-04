import OldHomepage from "@/components/OldHomepage";
import NewHomepage from "@/components/NewHomepage";

export default function Home() {
  if (process.env.NEXT_PUBLIC_NEW_HOMEPAGE === "true") {
    return <NewHomepage />;
  }

  return <OldHomepage />;
}
