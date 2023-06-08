import type { Component } from "solid-js";
import { FilledTonalLinkIconButton } from "material.resrc.ch";

const App: Component = () => {
  return (
    <div>
      <p>hello</p>
      <FilledTonalLinkIconButton icon={<div>ok</div>} href={"https://www.blog.resrc.ch"} />
    </div>
  );
};

export default App;
