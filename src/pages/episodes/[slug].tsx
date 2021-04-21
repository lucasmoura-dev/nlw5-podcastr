import { useRouter } from 'next/router';
// Coloquei [slug] mas poderia ser qualquer coisa, que representa o nome do episódio

export default function Episode() {
  const router = useRouter();

  return (
    <h1>{ router.query.slug }</h1>
  )
}