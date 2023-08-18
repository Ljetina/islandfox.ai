import Layout from '@/components/layout/Layout';
import { Pricing } from './pricingComp';

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

export default function Page() {
  return (
    // @ts-ignore TODO
    <Layout headTitle={"pricing"}>
      <Pricing />
    </Layout>
  );
}