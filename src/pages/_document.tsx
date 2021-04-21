/*
    Qual é o documento, qual o formato do html que fica em volta da aplicação.
    Ele vai ser chamado apenas uma vez.
*/
import Document, { Html, Head, Main, NextScript} from 'next/document';

// Por enquanto só aceita no formato de classe
export default class MyDocument extends Document {
    render() {
        // Main -> nossa aplicação
        // NextScript -> scripts que o next precisa injetar dentro da aplicação
        return (
            <Html>
                <Head>
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet" />
                </Head>
                <body>
                    <Main />
                    <NextScript /> 
                </body>
            </Html>
        );
    }
}