

export default function Roadmap() {
    return (
        <>
            <section className="roadmap-area pt-140 pb-130">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title text-center mb-70">
                                <h2 className="title title-animation">How it <span>works</span></h2>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-12 col-md-9">
                            <div className="roadmap-timeline-wrap">
                                <div className="roadmap-line" data-background="assets/img/brand/Line.svg" />
                                <ul className="list-wrap">
                                    <li>
                                        <div className="roadmap-item">
                                            <div className="roadmap-img wow fadeInLeft" data-wow-delay=".2s">
                                                <img src="/assets/img/images/roadmap_img01.png" alt="" />
                                                <span className="number">01</span>
                                            </div>
                                            <div className="roadmap-content wow fadeInRight" data-wow-delay=".2s">
                                                <h4 className="title">Selecting an AI tool</h4>
                                                <p>Choose from a variety of AI tools to write social media ads, hero sections, blog posts...</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="roadmap-item">
                                            <div className="roadmap-img wow fadeInRight" data-wow-delay=".2s">
                                                <img src="/assets/img/images/roadmap_img02.png" alt="" />
                                                <span className="number">02</span>
                                            </div>
                                            <div className="roadmap-content wow fadeInLeft" data-wow-delay=".2s">
                                                <h4 className="title">Write your keywords</h4>
                                                <p>Explain to the AI ​​what you want to write. The more details, the better output.</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="roadmap-item">
                                            <div className="roadmap-img wow fadeInLeft" data-wow-delay=".2s">
                                                <img src="/assets/img/images/roadmap_img03.png" alt="" />
                                                <span className="number">03</span>
                                            </div>
                                            <div className="roadmap-content wow fadeInRight" data-wow-delay=".2s">
                                                <h4 className="title">Let's the AI do its magic</h4>
                                                <p>Our highly trained AI understands your details and generate unique and human-like content in seconds.</p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}
