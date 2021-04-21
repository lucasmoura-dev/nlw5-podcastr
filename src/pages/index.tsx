// SPA (single page application) tradicional
// problema dessa abordagem, já queremos que o google indexe essa página, ele não vai aguardar essa requisição retornar
/*useEffect(() => {
  fetch('http://localhost:3333/episodes')
  .then(response => response.json())
  .then(data => console.log(data));
}, [])*/ // efeitos colaterias

import { useEffect } from "react";

// SSR (server side render)
// SSG (static side generator)

export default function Home(props) {

  return(
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  );

}

// SSR
// O nextjs já sabe que precisa executar essa função antes de retornar essa página pro usuário
// Executa toda vez que alguém acessar a aplicação
// Se ela não precisa ficar em tempo real, tipo podcast 1x por dia atualizar
// SSR: export async function getServerSideProps() {
export async function getStaticProps() {  // SSG -> só funciona em produção, tem que gerar build
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();
  
  // como estou retornando props, precisa sempre ter props no objeto
  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8// (a cada 8 horas) número em segundos, de quanto em quanto tempo eu quero gerar uma nova versão dessa página
  }
}