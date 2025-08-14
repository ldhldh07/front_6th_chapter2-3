import { BrowserRouter as Router } from "react-router-dom";

import { RootLayout } from "@/app/ui/layout.tsx";

import PostsManagerPage from "./pages/PostsManagerPage.tsx";

const App = () => {
  return (
    <Router>
      <RootLayout>
        <PostsManagerPage />
      </RootLayout>
    </Router>
  );
};

export default App;
