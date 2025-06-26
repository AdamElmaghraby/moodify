// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "./components/layout";
import Landing from "./components/landing";
// import Generator from "./components/generator"; // when you add more routes

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          {/* everything under Layout */}
          <Route path="/" element={<Layout />}>
            {/* index page */}
            <Route index element={<Landing />} />
            {/* future pages: */}
            {/* <Route path="chat" element={<Generator />} /> */}
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
