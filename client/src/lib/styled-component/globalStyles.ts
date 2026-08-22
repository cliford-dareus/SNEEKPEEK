import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  *, *::after, *::before {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    /* Surfaces */
    --dark--color-900: #050505;
    --dark--color-850: #0a0a0a;
    --dark--color-800: #121212;
    --dark--color-750: #1a1a1a;
    --dark--color-700: #222222;

    /* Legacy aliases */
    --bg--primary-900: var(--dark--color-900);
    --bg--primary-800: var(--dark--color-750);
    --bg--primary-500: #353535;
    --bg--primary-400: #282828;

    /* Text */
    --txt--color-100: #f5f5f5;
    --txt--color-200: #eeeeee;
    --txt--muted: #a3a3a3;
    --light--color-400: #c3c1c1;
    --light--color-600: #6b6b6b;
    --light--color-500: #8a8a8a;
    --light--color-300: #d4d4d4;

    /* Brand */
    --primary--color-400: #06b6d4;
    --primary--color-300: #22d3ee;
    --primary--color-500: #0891b2;
    --primary-color--900: #164e63;

    /* Semantic */
    --success: #22c55e;
    --danger: #ef4444;
    --warning: #f59e0b;

    /* Borders & effects */
    --border-subtle: rgba(255, 255, 255, 0.08);
    --border-strong: rgba(255, 255, 255, 0.14);
    --focus-ring: rgba(6, 182, 212, 0.25);
    --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.25);
    --shadow-md: 0 12px 40px rgba(0, 0, 0, 0.35);

    /* Radius */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-full: 9999px;

    /* Layout */
    --sidebar--width: 20rem;
    --sidebar--tablet-width: 6rem;
    --header-height: 60px;
    --content-gap: 1em;
  }

  body {
    font-family: "Poppins", system-ui, -apple-system, sans-serif;
    background-color: var(--dark--color-900);
    color: var(--txt--color-100);
    scroll-behavior: smooth;
    font-size: 15px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  ul {
    list-style-type: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }

  input, textarea {
    font-family: inherit;
  }

  ::selection {
    background: rgba(6, 182, 212, 0.35);
    color: white;
  }
`;
