import React from 'react'
import { useTableland } from '../../contexts/Tableland'
// import { toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';

export default function Test() {
    const notify = () => toast('Here is your toast.');

    const { readTable, writeTable, createTable } = useTableland()
    return (
			<div
				style={{
					height: "75vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					background: "green",
				}}
			>
				<button
					onClick={() =>
						createTable({ action: "TEST", object: { name: "noplacetohide" } })
					}
				>
					CREATE TABLE
				</button>
				<button
					onClick={() =>
						writeTable({
							user_address: "0x9910705C9F71626B3259f55cD0ab1392A5A50C10",
							f_id: "1",
							title: "Mango is good",
							tags: "fruits,mango",
							uri: "http://google.com",
							uri_type: "pinta",
						})
					}
				>
					WRITE TABLE
				</button>
				<button
					onClick={() =>
						readTable({
							user_address: "",
							f_id: "",
							title: "",
							tags: "",
							uri: "",
							uri_type: "",
						})
					}
				>
					READ TABLE
				</button>
				<button
					onClick={() =>
						readTable()
					}
				>
					READ TABLE2
				</button>
				<button onClick={notify}>Notify!</button>
			</div>
		);
}
