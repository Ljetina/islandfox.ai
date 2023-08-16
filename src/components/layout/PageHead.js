import Head from 'next/head'

const PageHead = ({ headTitle }) => {
    return (
        <>
            <Head>
                <title>
                    {headTitle ? headTitle : "Dex.AI - AI Writer & Tech Startup Landing Page Nextjs Template"}
                </title>
            </Head>
        </>
    )
}

export default PageHead