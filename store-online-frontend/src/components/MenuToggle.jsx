import { motion } from "framer-motion";

const Path = ({ isDarkMode, ...props }) => (
    <motion.path
        strokeWidth="3"
        stroke={isDarkMode ? "white" : "black"}
        strokeLinecap="round"
        {...props}
    />
);

export const MenuToggle = ({ toggle, isDarkMode }) => (
    <button onClick={toggle}>
        <svg fill="" width="23" height="23" viewBox="0 0 23 23">
            <Path
                isDarkMode={isDarkMode}
                variants={{
                    closed: { d: "M 2 2.5 L 20 2.5" },
                    open: { d: "M 3 16.5 L 17 2.5" },
                }}
            />
            <Path
                isDarkMode={isDarkMode}
                d="M 2 9.423 L 20 9.423"
                variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                }}
                transition={{ duration: 0.1 }}
            />
            <Path
                isDarkMode={isDarkMode}
                variants={{
                    closed: { d: "M 2 16.346 L 20 16.346" },
                    open: { d: "M 3 2.5 L 17 16.346" },
                }}
            />
        </svg>
    </button>
);
