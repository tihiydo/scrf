"use client"

import React, { useState } from 'react'
import styles from './filters.module.scss';
import { Select } from 'antd';

type Props =
    {
        status: "DECLINED" | "Converted" | "Fragmentations" | "Downloading" | "Unknown" | undefined | "All"
        setStatus: React.Dispatch<React.SetStateAction<"DECLINED" | "Converted" | "Fragmentations" | "Downloading" | "Unknown" | undefined | "All">>
    }

const DownloadsFilters = ({ setStatus, status }: Props) => {
    return (
        <section className={styles.filters}>
            <h3 className={styles.filtersTitle}>Filters</h3>

            <div>
                <Select
                    placeholder="Select status filter"
                    defaultValue={status}
                    style={{
                        marginTop: "20px",
                        width: 250,
                        color: "white",
                        backgroundColor: "gray"
                    }}
                    onChange={(e: "DECLINED" | "Converted" | "Fragmentations" | "Downloading" | "Unknown" | undefined | "All") => {
                        setStatus(e)
                    }}
                    options={[
                        {
                            value: 'DECLINED',
                            label: 'Declined',
                        },
                        {
                            value: 'Converted',
                            label: 'Converted',
                        },
                        {
                            value: 'Fragmentations',
                            label: 'Fragmentations',
                        },
                        {
                            value: 'Downloading',
                            label: 'Downloading',
                        },
                        {
                            value: 'Unknown',
                            label: 'Unknown',
                        },
                        {
                            value: 'All',
                            label: 'All',
                        }
                    ]}
                />
            </div>
        </section>
    )
}

export default DownloadsFilters