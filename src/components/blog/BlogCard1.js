import Link from "next/link"

export default function BlogCard1({ item }) {
    return (
        <>

            <div className="col-lg-4 col-md-6 col-sm-10">
                <div className="blog-grid-item">
                    <div className="blog-grid-thumb">
                        <Link href={`/blog/${item.id}`}><img src={`/assets/img/blog/${item.img}`} alt="" /></Link>
                    </div>
                    <div className="blog-grid-content">
                        <span className="date">March 24, 2023</span>
                        <h2 className="title"><Link href={`/blog/${item.id}`}>{item.title}</Link></h2>
                        <p>As a writer, marketer, or business owner, you understand that creating engaging, high-quality content is crucial to building a successful brand.</p>
                    </div>
                </div>
            </div>

        </>
    )
}
