import Link from "next/link";
import React from "react";
import MainArea from "./MainArea";

const MainAreaWith404 = () => (
  <MainArea>
    <h1>page not found</h1>
    <p>
      <Link href="/">
        <a>home</a>
      </Link>
    </p>
  </MainArea>
);

export default MainAreaWith404;
