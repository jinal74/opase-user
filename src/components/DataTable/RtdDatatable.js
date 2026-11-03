import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "../../styles/tablestyle.scss";

export default function RtdDatatable(props) {
	const [option, set_option] = useState(props.option);
	const [data, set_Data] = useState(props.data);
	const [columns, set_columns] = useState(props.columns);
	const [size_per_page, set_size_per_page] = useState([10, 25, 50, 100, 125,150,200]);

	useEffect(() => {
		set_option(props.option);
		set_Data(props.data);
		set_columns(props.columns);
		set_size_per_page([10, 25, 50, 100,125,150,200]);
	}, [props.option, props.data, props.columns]);

	const tableCall = (e) => {
		let value = e.target.value;
		let name = e.target.name;
		let tmp_option = option;
		if (name === "search") {
			if (value !== "" && value.length > 2) {
				tmp_option[name] = value;
			} else {
				tmp_option[name] = "";
			}
			set_option(tmp_option);
			props.tableCallBack(tmp_option);
		} else {
			if (value !== "") {
				tmp_option[name] = parseInt(value);
				tmp_option["page"] = 0;
				set_option(tmp_option);
				props.tableCallBack(tmp_option);
			}
		}
	};

	const sortHandler = (field) => {
		let tmp_option = option;
		if (field === tmp_option["sort"]) {
			tmp_option["order"] === "DESC" ? (tmp_option["order"] = "ASC") : (tmp_option["order"] = "DESC");
		} else {
			tmp_option["order"] = "ASC";
			tmp_option["sort"] = field;
		}
		set_option(tmp_option);
		props.tableCallBack(tmp_option);
	};

	const handlePageChange = (pageNumber) => {
		let tmp_option = option;
		tmp_option["page"] = pageNumber["selected"];
		set_option(tmp_option);
		props.tableCallBack(tmp_option);
	};

	return (
		option && (
			<div className="p-0 mb-3">
				{/* <div className="d-sm-flex align-items-center text-center">
					<div className="d-flex align-items-center">
						<div className="position-relative rtd-table-search-btn">
							<input type="search" name="search" className="form-control" onChange={tableCall} placeholder="Search ..." />
							<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M7.95473 1C6.57921 1 5.23459 1.40787 4.09089 2.17204C2.94719 2.93622 2.05579 4.02236 1.5294 5.29313C1.00301 6.5639 0.865287 7.96222 1.13364 9.31126C1.40199 10.6603 2.06436 11.8995 3.03699 12.8721C4.00963 13.8447 5.24884 14.507 6.59793 14.7754C7.94701 15.0437 9.34538 14.906 10.6162 14.3796C11.887 13.8533 12.9732 12.9619 13.7374 11.8182C14.5016 10.6746 14.9095 9.32997 14.9095 7.9545C14.9093 6.11009 14.1766 4.34125 12.8723 3.03706C11.5681 1.73286 9.7992 1.00012 7.95473 1V1Z" stroke="#5e5873" strokeWidth="1.875" strokeMiterlimit="10" />
								<path d="M13.143 13.1431L18.0001 18" stroke="#5e5873" strokeWidth="1.875" strokeMiterlimit="10" strokeLinecap="round" />
							</svg>
						</div>
					</div>
				</div> */}
				<div className="table-responsive rtd-table-main-div mt-3">
					<table className="table mb-0">
						<thead>
							<tr>
								{columns?.map((column, i) => {
									return column.options["sort"] ? (
										<th key={i} onClick={() => sortHandler(column.value)}>
											{column.label}
											{column.value !== option["sort"] ? (
												<>
													<button type="button" className="border-0 bg-transparent p-0 sorting-top">
														<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M5 0.5L10 5.5H0L5 0.5Z" fill="#5E5873" />
														</svg>
													</button>
													<button type="button" className="border-0 bg-transparent p-0 sorting-bottom">
														<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M5 5.5L10 0.5H0L5 5.5Z" fill="#5E5873" />
														</svg>
													</button>
												</>
											) : column.value === option["sort"] && option["order"] === "ASC" ? (
												<button type="button" className="border-0 bg-transparent p-0 sorting-top">
													<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M5 0.5L10 5.5H0L5 0.5Z" fill="#5E5873" />
													</svg>
												</button>
											) : (
												<button type="button" className="border-0 bg-transparent p-0 sorting-bottom">
													<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M5 5.5L10 0.5H0L5 5.5Z" fill="#5E5873" />
													</svg>
												</button>
											)}
										</th>
									) : (
										<th key={i}>{column.label}</th>
									);
								})}
							</tr>
						</thead>
						<tbody>
							{data?.length > 0 ? (
								data.map((val, i) => {
									return (
										<tr key={i}>
											{columns.map((col, index) => {
												return <td key={index}>{col.options.customBodyRender ? col.options.customBodyRender(data, i) : data[i][col.value]}</td>;
											})}
										</tr>
									);
								})
							) : (
								<tr className="p-md-5 p-3 m-md-5 text-center">
									<td colSpan={columns.length}>
										<p>Sorry, no matching records found</p>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				<div className="row align-items-center custom-table-btm text-center">
					{option.totalRecord > 0 && (
						<div className="col-sm-12 d-md-flex align-items-center">
							<div className="custom-table-page text-start">
								Showing {parseInt(option.page * option.sizePerPage + 1)} to {parseInt(option.page * option.sizePerPage + option.sizePerPage) > option.totalRecord ? option.totalRecord : parseInt(option.page * option.sizePerPage + option.sizePerPage)} of {option.totalRecord} entries
							</div>

							<div className="ms-auto d-sm-flex align-items-center mt-3 mt-md-0">
								<div className="me-3">
									<label className="d-flex align-items-center custom-select-label">
										Show
										<select name="sizePerPage" className="form-select mx-2" defaultValue={option.sizePerPage} onChange={tableCall}>
											{size_per_page.map((val, i) => {
												return (
													<option key={i} value={val}>
														{val}
													</option>
												);
											})}
										</select>
										entries
									</label>
								</div>
								<div className="pagination-custom-info mt-3 mt-sm-0 d-flex align-items-center">
									<ReactPaginate
										className="pagination"
										pageClassName="page-item"
										activeClassName="active"
										breakLabel="..."
										breakLinkClassName="page-link"
										breakClassName="page-item"
										previousLabel={
											<span aria-hidden="true">
												<svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left">
													<polyline points="15 18 9 12 15 6"></polyline>
												</svg>
											</span>
										}
										previousClassName="page-item"
										nextLabel={
											<span aria-hidden="true">
												<svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
													<polyline points="9 18 15 12 9 6"></polyline>
												</svg>
											</span>
										}
										nextClassName="page-item"
										pageLinkClassName="page-link"
										pageRangeDisplayed={2}
										onPageActive={option.page}
										pageCount={option.totalRecord / option.sizePerPage}
										renderOnZeroPageCount={null}
										onPageChange={handlePageChange.bind()}
										forcePage={option.page}
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		)
	);
}
