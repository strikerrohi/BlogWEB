import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
// import { Icon } from "@/components/ui/icon";
import  Link  from "next/link";
import Image from "next/image";
import Footer from "./Footer";
import Navbar from "./Navbar";
import HomeBanner from "./HomeBanner";
import Subscribe from "./Subscribe";
import MainContent from "./MainContent";

// Home Page Component
export default function HomePage(): JSX.Element {
  return (
    <div className="">
      {/* Header Section */}
     {/* <Navbar/> */}

      {/* Hero Section */}
<HomeBanner/>
      {/* Latest Posts Section */}

      <MainContent/>

      {/* Newsletter Section */}
      {/* <Subscribe/> */}

      {/* Footer Section */}
      {/* <Footer/> */}
    </div>
  );
}
