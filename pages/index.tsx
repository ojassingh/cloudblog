import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify, API, Auth, withSSRContext } from 'aws-amplify';
import Head from 'next/head';
import awsExports from '../src/aws-exports';
import { createPost } from '../src/graphql/mutations';
import { listPosts } from '../src/graphql/queries';
import styles from '../styles/Home.module.css';

Amplify.configure({ ...awsExports, ssr: true });

export async function getServerSideProps({req}:any) {
  const SSR = withSSRContext({ req });
  try { 
    const response = await SSR.API.graphql({ query: listPosts });
    return {
      props: {
        posts: response.data.listPosts.items,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {},
    };
  }
}

async function handleCreatePost(event:any) {
  event.preventDefault();

  const form = new FormData(event.target);

  try {
    const { data }:any = await API.graphql({
      authMode: 'AMAZON_COGNITO_USER_POOLS',
      query: createPost,
      variables: {
        input: {
          title: form.get('title'),
          content: form.get('content')
        }
      }
    });

    window.location.href = `/posts/${data.createPost.id}`;
  } catch ({errors}) {
    // console.error("...errors");
    // throw new Error(errors[0].message);
  }
}

export default function Home({ posts = [] }) {
  return (
    <div className=''>
      <Head>
        <title>Welcome</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
         <div className='text-6xl font-bold px-20 py-20'>Kaisa hai bhosdi ke</div>
      </main>
    </div>
  );
}