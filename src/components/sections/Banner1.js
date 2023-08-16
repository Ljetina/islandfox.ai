import Link from "next/link"
import Typewriter from 'typewriter-effect'

export default function Banner1() {
    return (
        <>
            <section className="banner-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="banner-content ta-animated-headline">
                                <h2 className="title ah-headline wow fadeInUp" data-wow-delay=".2s">
                                    <span>The chat assistant for the <br /> </span>
                                    <Typewriter tag="span"
                                        options={{
                                            wrapperClassName: "ah-words-wrapper",
                                            strings: ['power user', 'high achiever', 'state of flow', 'burst of inspiration', 'deep conversation', 'business edge'],
                                            autoStart: true,
                                            loop: true,
                                        }}
                                    />
                                </h2>
                                <p className="wow fadeInUp" data-wow-delay=".4s">We offer a premium chat assistant service that is deeply integrated with hand picked plugins. Keep the conversation going with automatic advanced memory and context management.</p>
                                {/* <p className="wow fadeInUp" data-wow-delay=".4s">IslandFox.AI is not just another AI assistant. Designed for power users, it comes with best-in-class models, intelligent memory and context management, and convenient integrations with services like Google Search, Wikipedia, Arxiv, and more. Perfect for individuals or small-scale operations looking to harness the power of AI.</p> */}
                                <div className="banner-btn">
                                    <Link href="/waiting" className="gradient-btn wow fadeInLeft" data-wow-delay=".6s">Sign up for the waiting list</Link>
                                    <Link href="/features" className="gradient-btn gradient-btn-two wow fadeInRight" data-wow-delay=".6s">See How IslandFox.AI Works</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}