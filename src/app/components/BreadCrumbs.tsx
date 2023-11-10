import React from "react";
import Link from "next/link";
import styles from "../styles/filter.module.css";
import Image from "next/image";
export const BreadCrumbs = ({ breadCrumbs }) => {
    return (
        <div style={{ display: "flex", paddingLeft: "30px" }}>
            {breadCrumbs?.map((breadCrumb, index) => (
                <div key={index} className={styles.breadCrumbs}>
                    <Link
                        href={breadCrumb.url}
                        className={styles.black}
                    >
                        <div style={{ color: "black", borderBottom: "1px black solid" }}>
                            {breadCrumb.name}
                        </div>
                    </Link>
                    {/* <div style={{ color: "black", paddingLeft: "10px" }}>/</div> */}
                    {breadCrumbs?.length - 1 !== index && (
                        <div className={styles.arrow}>
                            <Image
                                src="/static/right-arrow.webp"
                                alt="buy a used or new business copier"
                                width={15}
                                height={15}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

