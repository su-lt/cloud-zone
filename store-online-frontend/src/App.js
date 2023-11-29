import { Route, Routes } from "react-router-dom";
import routes from "./routes";

import Footer from "./pages/Footer";
import Header from "./pages/Header";
// import LayoutSection from "./components/LayoutSection";

function App() {
    return (
        <>
            {/* header */}
            <Header />
            {/* layout amination appearing */}
            {/* <LayoutSection /> */}

            {/* routes */}
            <Routes>
                {routes.map((page, idx) => {
                    return (
                        <Route
                            path={page.path}
                            element={page.element}
                            key={idx}
                        />
                    );
                })}
            </Routes>
            {/* footer */}
            <Footer />
        </>
    );
}

export default App;
