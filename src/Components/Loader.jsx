import React from 'react'
import './Loader.css'
import { IoMdCloseCircleOutline } from "react-icons/io";

import { useLoader } from '../contexts/LoaderContext'
export default function Loader() {
    const { loader, setLoader } = useLoader();
    return (
        loader?.loading && (
            <div className="loading">
                <div className='loaderBtn' onClick={() => setLoader({ loading: false, type: 'default' })}>
                    <IoMdCloseCircleOutline color='white' size={50} />
                </div>
            </div>
        )
    )
}
