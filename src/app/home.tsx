'use client';

import { getServerSession } from 'next-auth';

import { LoginButton, LogoutButton } from '@/components/buttons.component';
// Template components
import Layout from '@/components/layout/Layout';
import Banner1 from '@/components/sections/Banner1';

// import Counter1 from '@/components/sections/Counter1';
// import Pricing1 from '@/components/sections/Pricing1';
// import Roadmap from '@/components/sections/Roadmap';
// import Testimonial1 from '@/components/sections/Testimonial1';
import Tools from '@/components/sections/Tools';
// import UseCases from '@/components/sections/UseCases';
// import Video from '@/components/sections/Video';
// import Writing from '@/components/sections/Writing';
import '/public/assets/css/animate.min.css';
import '/public/assets/css/animatedheadline.css';
import '/public/assets/css/bootstrap.min.css';
import '/public/assets/css/default.css';
import '/public/assets/css/fontawesome-all.min.css';
import '/public/assets/css/magnific-popup.css';
import '/public/assets/css/odometer.css';
import '/public/assets/css/responsive.css';
import '/public/assets/css/select2.min.css';
import '/public/assets/css/style.css';

import { authOptions } from '@/lib/auth';

export function WebHome() {
  return (
    <>
      {/* @ts-ignore TODO */}
      <Layout mainCls="main-content fix" headTitle={"home"}>
        <Banner1 />
        {/* <Tools /> */}
      </Layout>
    </>
  );
}

// {/* <Banner1 />
//       <Video />
//       <Counter1 />
//       <Writing />
//       <UseCases />
//       <Roadmap />
//       <Pricing1 />
//       <Tools />
//       <Testimonial1 />
//       <main className="flex min-h-screen flex-col items-center justify-between p-24">
//         <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
//           <div>
//             {/* {!session && <LoginButton />} */}
//             {/* {!!session && <LogoutButton />} */}
//           </div>
//         </div>
//       </main> */}
