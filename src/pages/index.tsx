import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link'; // com o Link, continua o funcionamento de SPA, sem ter que carregar toda a página ao mover de rota
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../components/utils/convertDurationToTimeString';

import styles from './home.module.scss';

// SPA (single page application) tradicional
// problema dessa abordagem, já queremos que o google indexe essa página, ele não vai aguardar essa requisição retornar
/*useEffect(() => {
  fetch('http://localhost:3333/episodes')
  .then(response => response.json())
  .then(data => console.log(data));
}, [])*/ // efeitos colaterias


// SSR (server side render)
// SSG (static side generator)

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
  //
}

type HomeProps = {
  latestEpisodes: Episode[],
  allEpisodes: Episode[],
}

/*
Dica: toda vez que for fazer a formatação dos dados que estão vindo da API, 
faça a formatação antes de chegar no return do componente em si. E não dentro
do return. Pra retornar os dados pro componente já formatados. Pra evitar
renderização desnecessárias.

*/

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {

  return(
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {
            latestEpisodes.map(episode => {
              // Usando o componente Image do nextjs porque ela precisa de otimização
              // O nextjs vai o redimensionamento automaticamente. Width e height são as dimensões da imagem que será carregada, e não mostrada
              // coloquei 192 por causa de telas retinas com densidade de pixel, multiplo x 3 o tamanho a ser exibido 64 x 3 = 192
              return (
                <li key={episode.id}>
                  <Image 
                    width={192} 
                    height={192} 
                    src={episode.thumbnail} 
                    alt={episode.title} 
                    objectFit="cover"
                  />

                  <div className={styles.episodeDetails}>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>

                  <button type="button">
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>
                </li>
              );
            })
          }
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image 
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <a href="">{episode.title}</a>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </td>
                </tr>
              )
            })
            }
          </tbody>
        </table>
      </section>
    </div>
  );

}

// SSR
// O nextjs já sabe que precisa executar essa função antes de retornar essa página pro usuário
// Executa toda vez que alguém acessar a aplicação
// Se ela não precisa ficar em tempo real, tipo podcast 1x por dia atualizar
// SSR: export async function getServerSideProps() {
export const getStaticProps: GetStaticProps = async () => {  // SSG -> só funciona em produção, tem que gerar build
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    }
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);
  
  // como estou retornando props, precisa sempre ter props no objeto
  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8// (a cada 8 horas) número em segundos, de quanto em quanto tempo eu quero gerar uma nova versão dessa página
  }
}