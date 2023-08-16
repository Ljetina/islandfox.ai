

import { useState } from "react"
export default function Speech() {

    const [isToggled, setToggled] = useState(false)
    const toggleTrueFalse = () => setToggled(!isToggled)
    return (
        <>
            <section className="speech-area">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-10">
                            <div className="speech-item">
                                <form className="engine-form">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="lang-ordering">
                                                <select id="id_select2_example" style={{ width: '100%' }}>
                                                    <option data-img_src="/assets/img/images/flag01.png">English (American)</option>
                                                    <option data-img_src="/assets/img/images/flag02.png">English (British)</option>
                                                    <option data-img_src="/assets/img/images/flag03.png">Bengali (Bangladesh)</option>
                                                    <option data-img_src="/assets/img/images/flag04.png">English (Canada)</option>
                                                    <option data-img_src="/assets/img/images/flag05.png">Zulu (South Africa)</option>
                                                    <option data-img_src="/assets/img/images/flag06.png">Hindi (India)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="voice-ordering">
                                                <select id="id_select2_example_two" style={{ width: '100%' }}>
                                                    <option data-img_src="/assets/img/images/s_voice_img01.png">Amber (HD)</option>
                                                    <option data-img_src="/assets/img/images/s_voice_img02.png">Brandon (HD)</option>
                                                    <option data-img_src="/assets/img/images/s_voice_img03.png">Tony (HD)</option>
                                                    <option data-img_src="/assets/img/images/s_voice_img04.png">Michael (HD)</option>
                                                    <option data-img_src="/assets/img/images/s_voice_img05.png">Sara (HD)</option>
                                                    <option data-img_src="/assets/img/images/s_voice_img06.png">Prabhat (HD)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-grp">
                                        <textarea   placeholder="Enter Text here.." />
                                        <div className="form-content">
                                            <span>Free use of Voicer Studio is limited to 50 characters. For more <br /> usage and premium voices, you can purchase packages.</span>
                                            <span id="maxLenghtCounter" className="badge-default">0 characters</span>
                                        </div>
                                    </div>
                                    <button className="speech-btn" onClick={toggleTrueFalse}>
                                        <span />
                                        <span />
                                        <span />
                                        text to speech
                                    </button>
                                    <div className="hidden-btn-wrap" style={{ display: `${isToggled ? "block" : "none"}` }}>
                                        <div className="hidden-btn-inner">
                                            <button ><i className="fas fa-play" />listen</button>
                                            <button  className="download"><i className="fas fa-download" />Download</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-10">
                            <div className="speech-item">
                                <div className="browser-upload">
                                    <input type="file" />
                                    <h6 className="title"><i className="fas fa-file-import" />Browser</h6>
                                    <span>.mp3</span>
                                    <span>.wav</span>
                                </div>
                                <form action="#" className="engine-form-two">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-grp">
                                                <input type="text" placeholder="Give a name to your work" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-grp">
                                                <select id="punctuation-select2" style={{ width: '100%' }}>
                                                    <option value={1}>Punctuation: Auto</option>
                                                    <option value={2}>Punctuation: Off</option>
                                                    <option value={3}>Punctuation: On</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-grp">
                                                <select id="profanity-select2" style={{ width: '100%' }}>
                                                    <option value={1}>Profanity Filter: On</option>
                                                    <option value={2}>Profanity Filter: Off</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-grp">
                                                <select id="id_select2_example_three" style={{ width: '100%' }}>
                                                    <option data-img_src="/assets/img/images/flag01.png">English (American)</option>
                                                    <option data-img_src="/assets/img/images/flag02.png">English (British)</option>
                                                    <option data-img_src="/assets/img/images/flag03.png">Bengali (Bangladesh)</option>
                                                    <option data-img_src="/assets/img/images/flag04.png">English (Canada)</option>
                                                    <option data-img_src="/assets/img/images/flag05.png">Zulu (South Africa)</option>
                                                    <option data-img_src="/assets/img/images/flag06.png">Hindi (India)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-content">
                                        <span>Voicer Transcribe free use is limited to 5 minutes. You can <br /> purchase packages for more use and to transcribe longer files.</span>
                                        <span className="badge-default" id="infos">00 Minutes</span>
                                    </div>
                                    <button >
                                        <span />
                                        <span />
                                        <span />
                                        Convert audio to text
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="speech-shape-wrap">
                    <div className="shape-one" data-background="assets/img/images/speech_shape01.png" />
                    <div className="shape-two" data-background="assets/img/images/speech_shape02.png" />
                </div>
            </section>

        </>
    )
}
