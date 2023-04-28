import Head from "next/head";
import Header from "@/components/header";

export default function MyTicks({ metamaskMessage, setMetamaskMessage, isWalletConnected, setIsWalletConnected, setProvider, setAddress }) {
    return(
        <>
            <Head>
                <title>Zanontickets - My Events</title>
                <meta name="description" content="View your events" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header metamaskMessage={metamaskMessage} setMetamaskMessage={setMetamaskMessage} isWalletConnected={isWalletConnected} setIsWalletConnected={setIsWalletConnected} setProvider={setProvider} setAddress={setAddress}></Header>
            <main>
                
            </main>
        </>
    )
}