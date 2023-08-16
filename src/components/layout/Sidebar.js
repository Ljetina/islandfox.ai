import Link from "next/link"
import { useState } from "react"

export default function Sidebar() {
    const [isActive, setIsActive] = useState({
        status: false,
        key: "",
    })

    const handleToggle = (key) => {
        if (isActive.key === key) {
            setIsActive({
                status: false,
            })
        } else {
            setIsActive({
                status: true,
                key,
            })
        }
    }
    return (
        <>
            <ul className="navigation">
                <li className="active menu-item-has-children tg-mega-menu-has-children"><Link href="/#">Home</Link>
                    <div className="tg-mega-menu-wrap black-bg" style={{ display: `${isActive.key == 1 ? "block" : "none"}` }}>
                        <div className="row row-cols-1 row-cols-lg-4 row-cols-xl-4">
                            <div className="col">
                                <div className="mega-menu-item active">
                                    <div className="mega-menu-thumb">
                                        <Link href="/"><img src="assets/img/images/home_img01.jpg" alt="" /></Link>
                                    </div>
                                    <div className="mega-menu-content">
                                        <h4 className="title"><Link href="/">01: Ai Content Writer</Link></h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="mega-menu-item">
                                    <div className="mega-menu-thumb">
                                        <Link href="/index-2"><img src="assets/img/images/home_img02.jpg" alt="" /></Link>
                                    </div>
                                    <div className="mega-menu-content">
                                        <h4 className="title"><Link href="/index-2">02: Text to Video Ai</Link></h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="mega-menu-item">
                                    <div className="mega-menu-thumb">
                                        <Link href="/index-3"><img src="assets/img/images/home_img03.jpg" alt="" /></Link>
                                    </div>
                                    <div className="mega-menu-content">
                                        <h4 className="title"><Link href="/index-3">03:Text to Speech Ai</Link></h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="mega-menu-item">
                                    <div className="mega-menu-thumb">
                                        <img src="assets/img/images/coming_soon.jpg" alt="" />
                                    </div>
                                    <div className="mega-menu-content">
                                        <h4 className="title">04: Coming Soon</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dropdown-btn" onClick={() => handleToggle(1)}><span className="fas fa-angle-down" /></div></li>
                <li><Link href="/about">About Us</Link></li>
                <li className="menu-item-has-children"><Link href="/#">Pages</Link>
                    <ul className="sub-menu" style={{ display: `${isActive.key == 2 ? "block" : "none"}` }}>
                        <li><Link href="/work">How It Work</Link></li>
                        <li><Link href="/faq">Faq Page</Link></li>
                        <li><Link href="/help">Help Center</Link></li>
                        <li><Link href="/job">Job Page</Link></li>
                        <li><Link href="/job-details">Job Details</Link></li>
                        <li><Link href="/login">Login Page</Link></li>
                        <li><Link href="/404">404 Error Page</Link></li>
                    </ul>
                    <div className="dropdown-btn" onClick={() => handleToggle(2)}><span className="fas fa-angle-down" /></div></li>
                <li className="menu-item-has-children"><Link href="/#">News</Link>
                    <ul className="sub-menu" style={{ display: `${isActive.key == 3 ? "block" : "none"}` }}>
                        <li><Link href="/blog">Our Blog</Link></li>
                        <li><Link href="/blog-details">Blog Details</Link></li>
                    </ul>
                    <div className="dropdown-btn" onClick={() => handleToggle(3)}><span className="fas fa-angle-down" /></div></li>
                <li><Link href="/contact">contacts</Link></li>
            </ul>

        </>
    )
}
