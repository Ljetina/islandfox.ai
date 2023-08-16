// import { getServerSession } from 'next-auth';

import { getServerSession } from "next-auth";
import { WebHome } from "./home";
import { authOptions } from "@/lib/auth";

// import { LoginButton, LogoutButton } from '@/components/buttons.component';
// Template components
// import Layout from '@/components/layout/Layout';
// import Banner1 from '@/components/sections/Banner1';
// import Counter1 from '@/components/sections/Counter1';
// import Pricing1 from '@/components/sections/Pricing1';
// import Roadmap from '@/components/sections/Roadmap';
// import Testimonial1 from '@/components/sections/Testimonial1';
// import Tools from '@/components/sections/Tools';
// import UseCases from '@/components/sections/UseCases';
// import Video from '@/components/sections/Video';
// import Writing from '@/components/sections/Writing';

// import { authOptions } from '@/lib/auth';

export default async function Home() {
  const session = await getServerSession(authOptions);
  return <WebHome />
  // return <div>TEST</div>;
  // (
  //   <Layout mainCls="main-content fix" headerStyle={1} footerStyle={1}>
  //     <Banner1 />
  //     <Video />
  //     <Counter1 />
  //     <Writing />
  //     <UseCases />
  //     <Roadmap />
  //     <Pricing1 />
  //     <Tools />
  //     <Testimonial1 />
  //     <main className="flex min-h-screen flex-col items-center justify-between p-24">
  //       <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
  //         <div>
  //           {!session && <LoginButton />}
  //           {!!session && <LogoutButton />}
  //         </div>
  //       </div>
  //     </main>
  //   </Layout>
  // );
}

// import Preloader from "@/components/elements/Preloader"
// import { useEffect, useState } from "react"

// import "slick-carousel/slick/slick-theme.css"
// import "slick-carousel/slick/slick.css"
// import "/public/assets/css/animate.min.css"
// import "/public/assets/css/bootstrap.min.css"
// import "/public/assets/css/fontawesome-all.min.css"
// import "/public/assets/css/magnific-popup.css"
// import "/public/assets/css/odometer.css"
// import "/public/assets/css/animatedheadline.css"
// import "/public/assets/css/default.css"
// import "/public/assets/css/select2.min.css"
// import "/public/assets/css/style.css"
// import "/public/assets/css/responsive.css"

// function MyApp({ Component, pageProps }) {
//     const [loading, setLoading] = useState(true)
//     useEffect(() => {
//         setTimeout(() => {
//             setLoading(false)
//         }, 1000)
//     }, [])
//     return (<>
//         {!loading ? (
//             <Component {...pageProps} />
//         ) : (
//             <Preloader />
//         )}
//     </>)
// }

// export default MyApp
