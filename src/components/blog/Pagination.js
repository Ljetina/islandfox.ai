
export default function Pagination({
    prev,
    currentPage,
    getPaginationGroup,
    next,
    pages,
    handleActive,
}) {
    return (
        <>

            <div className="blog-pev-next-wrap">
                {/* <ul className="list-wrap">
                    <li>
                        <Link href="/blog"><i className="far fa-arrow-left" />Previous</Link>
                    </li>
                    <li className="next-post">
                        <Link href="/blog"><i className="far fa-arrow-right" />Next</Link>
                    </li>
                </ul> */}


                <ul className="list-wrap">
                    {getPaginationGroup.length <= 0 ? null : (
                        <li onClick={prev}>
                            {currentPage === 1 ? null : (
                                <a>
                                    <i className="fa fa-arrow-left" />
                                </a>
                            )}
                        </li>
                    )}

                    {getPaginationGroup.map((item, index) => {
                        return (
                            <li
                                onClick={() => handleActive(item)}
                                key={index}
                                className={
                                    currentPage === item ? " active" : ""
                                }
                            >
                                <a>{item}</a>
                            </li>
                        )
                    })}

                    {getPaginationGroup.length <= 0 ? null : (
                        <li onClick={next}>
                            {currentPage >= pages ? null : (
                                <a>
                                    <i className="fa fa-arrow-right" />
                                </a>
                            )}
                        </li>
                    )}
                </ul>

            </div>
        </>
    )
}