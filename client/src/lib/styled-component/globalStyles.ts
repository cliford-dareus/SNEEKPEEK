import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,900&display=swap');
    
    *, *::after, *::before {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    :root{
        --bg--primary-900: #000000;
        --bg--primary-800: #1a1a1a;
        --bg--primary-500: #353535;
        --bg--primary-400: #282828;

        --sidebar--width: 20rem;
        --sidebar--tablet-width: 6rem;


        //Color variables
        --dark--color-900: #000000;
        --dark--color-800: #0a0a0a;

        --light--color-400: ;
        --light--color-400: ;
        --light--color-400: ;
        --light--color-400: ;

        --primary-color--900: ;
        --primary--color-400: #06b6d4;
        --primary--color-200: ;


        --txt--color-100: whitesmoke;
        --txt--color-200: #eee;
    }

    body{
        font-family: 'Poppins', sans-serif;
        background-color: var(--dark--color-900);
        color: var(--txt--color-100);
    }

    ul{
        list-style-type: none;
    }

    a{
        text-decoration: none;
    }
    img{
        max-width: 100%;
        display: block;
    }
`;
