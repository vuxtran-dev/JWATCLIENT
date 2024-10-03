import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from "react-hook-form";
import '../src/App.css'
import {
    Checkbox,
    TextInput,
    Table,
    Modal,
    Pagination,
    Toast
} from "flowbite-react";
import { HiCheck } from "react-icons/hi";

const itemsPerPage = 5;

function Table1() {
    const [data, setData] = useState([
        { id: 1, name: 'Apple MacBook Pro 17"', color: 'Silver', category: 'Laptop', price: 2999 },
        { id: 2, name: 'Microsoft Surface Pro', color: 'White', category: 'Laptop PC', price: 1999 },
        { id: 3, name: 'Magic Mouse 2', color: 'Black', category: 'Accessories', price: 99 },
        { id: 4, name: 'Apple MacBook Pro 17"', color: 'Silver', category: 'Laptop', price: 2999 },
        { id: 5, name: 'Microsoft Surface Pro', color: 'White', category: 'Laptop PC', price: 1999 },
        { id: 6, name: 'Magic Mouse 2', color: 'Black', category: 'Accessories', price: 99 },
        { id: 7, name: 'Apple MacBook Pro 17"', color: 'Silver', category: 'Laptop', price: 2999 },
        { id: 8, name: 'Microsoft Surface Pro', color: 'White', category: 'Laptop PC', price: 1999 },
        { id: 9, name: 'Magic Mouse 2', color: 'Black', category: 'Accessories', price: 99 },
        { id: 10, name: 'Magic Mouse 2', color: 'Black', category: 'Accessories', price: 99 },
    ]);
    const [searchResults, setSearchResults] = useState(data);
    const [searchValue, setSearchValue] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openNew, setOpenNew] = useState(false);
    const [addRow, setAddRow] = useState({})
    const [pageData, setPageData] = useState({
        currentPage: 1,
        itemPerPage: itemsPerPage,
    });
    const [sortPage, setSortPage] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [nextId, setNextId] = useState(data.length > 0 ? data[data.length - 1].id + 1 : 1);
    const [toast, setToast] = useState({ visible: false, message: '' });

    const totalPages = useMemo(() => Math.ceil(searchResults.length / pageData.itemPerPage), [searchResults, pageData]);

    const handleSelectAllChange = (value) => {
        const checked = value.target.checked;
        setIsSelectAll(checked);
        setSelectedRows(checked ? data.map(item => item.id) : [])
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ values: selectedRow });

    const onSubmit = (data) => {
        console.log(data);
        handleRowEdit(data);
        handleCloseEdit();
    };

    const showToast = (message) => {
        setToast({ visible: true, message });
        setTimeout(() => setToast({ visible: false, message: '' }), 3000);
    };

    const sortData = (data) => {
        return [...data].sort((a, b) => {
            if (a[sortPage] < b[sortPage]) {
                return sortOrder === 'asc' ? -1 : 1;
            }
            if (a[sortPage] > b[sortPage]) {
                return sortOrder === 'asc' ? 1 : -1;
            }
            return 0;
        })
    };

    const handleSort = (criteria) => {
        if (sortPage === criteria) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortPage(criteria);
            setSortOrder('asc');
        }

    };

    const a = useMemo(() => {
        const data = searchResults.slice(
            (pageData.currentPage - 1) * pageData.itemPerPage,
            (pageData.currentPage) * pageData.itemPerPage,
        )
        return data
    }, [pageData, searchResults])

    const handleAllPagesChange = (value) => {
        const b = { ...pageData, currentPage: value }
        setPageData(b)
    }

    const handleCheckboxChange = (id) => {
        setSelectedRows((prevSelectedRows) => {
            if (prevSelectedRows.includes(id)) {
                return prevSelectedRows.filter(rowId => rowId !== id);
            } else {
                return [...prevSelectedRows, id];
            }
        });
    };

    useEffect(() => {
        if (data.length === selectedRows.length) {
            setIsSelectAll(true)
        } else {
            setIsSelectAll(false)
        }
    })

    const deleteAll = () => {
        if (selectedRows.length > 0) {
            const updatedRows = data.filter(row => !selectedRows.includes(row.id));
            setData(updatedRows);
            setSelectedRows([]);
            handleCloseDelete();
            showToast('Item updated successfully.');
        }
    }

    const deleteRow = () => {
        const updatedRows = data.filter(row => row.id != selectedRow.id);
        setData(updatedRows);
        handleClose();
        showToast('Item updated successfully.');
    }

    const handleClickOpen = (value) => {
        setSelectedRow(value)
        setOpen(true);
    };
    const handleClickOpenDelete = () => {
        setOpenDelete(true)
    }

    const handleClose = () => {
        setOpen(false);
    };
    const selectedRowsData =
        data.filter(row => selectedRows.includes(row.id));

    const handleClickOpenEdit = (value) => {
        setSelectedRow(value);
        setOpenEdit(true);
    };


    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false)
    }

    const handleCreateNew = () => {
        const item = {
            id: nextId,
            name: ' ',
            color: ' ',
            category: '',
            price: 0
        }
        setAddRow(item);
        setOpenNew(true)
    }

    const handleClickOpenNew = () => (
        setOpenNew(true)
    )

    const handleCloseNew = () => (
        setOpenNew(false)
    )

    const handleRowEdit = (updatedRow) => {
        const updatedRows = data.map(row =>
            row.id === updatedRow.id ? { ...row, ...updatedRow } : row
        );
        setData(updatedRows);
        showToast('Item updated successfully.');
    }
    const handleConfirmAddRow = () => {
        setData([addRow, ...data]);
        setNextId(nextId + 1);
        showToast('Item updated successfully.');
    }

    const handleSearch = (searchValue) => {
        var searchResults = data.filter(
            item =>
                item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                item.id.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
                item.color.toLowerCase().includes(searchValue.toLowerCase()) ||
                item.category.toLowerCase().includes(searchValue.toLowerCase()) ||
                item.price.toString().includes(searchValue.toLowerCase())
        );
        searchResults = sortData(searchResults)
        setSearchResults(searchResults);
        setPageData({
            ...pageData,
            currentPage: 1
        })
    };
    useEffect(() => {
        handleSearch(searchValue);
    }, [searchValue, data, sortPage, sortOrder])

    return (
        <div className='p-24 items-center justify-center'>
            <div className='fixed right-24 top-10'>
                {toast.visible && (

                    <Toast>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                            <HiCheck className="h-5 w-5 " />
                        </div>
                        <div className="ml-3 text-sm font-bold">{toast.message}</div>
                        <Toast.Toggle />
                    </Toast>

                )}
            </div>
            <TextInput placeholder="tìm kiếm"
                className='max-w-md mb-4 rounded-lg '
                onChange={(event) => {
                    setSearchValue(event.target.value);
                }}
                value={searchValue}>
            </TextInput>
            <div className="overflow-x-auto border rounded-lg shadow-lg mx-auto">
                <Table>
                    <Table.Head>
                        <Table.HeadCell><Checkbox
                            checked={isSelectAll}
                            onChange={handleSelectAllChange} /></Table.HeadCell>
                        <Table.HeadCell onClick={() => handleSort('id')} className='cursor-pointer'>
                            Id {sortPage === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </Table.HeadCell>
                        <Table.HeadCell onClick={() => handleSort('name')} className='cursor-pointer'>
                            Product name {sortPage === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </Table.HeadCell>
                        <Table.HeadCell onClick={() => handleSort('color')} className='cursor-pointer'>
                            Color {sortPage === 'color' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </Table.HeadCell>
                        <Table.HeadCell onClick={() => handleSort('category')} className='cursor-pointer'>
                            Category {sortPage === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </Table.HeadCell>
                        <Table.HeadCell onClick={() => handleSort('price')} className='cursor-pointer'>
                            Price {sortPage === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </Table.HeadCell>
                        <Table.HeadCell>
                            <span className="sr-only">Edit</span>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y" >
                        {a.map(item => (
                            <Table.Row
                                key={item.id}
                                className={`bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-slate-100 cursor-pointer`}
                                onDoubleClick={() => handleClickOpenEdit(item)}

                            >
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white ">
                                    <Checkbox
                                        checked={selectedRows.includes(item.id)}
                                        onChange={() =>
                                            handleCheckboxChange(item.id)}></Checkbox>
                                </Table.Cell>
                                <Table.Cell>{item.id}</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item.name}
                                </Table.Cell>
                                <Table.Cell>{item.color}</Table.Cell>
                                <Table.Cell>{item.category}</Table.Cell>
                                <Table.Cell>{item.price}</Table.Cell>
                                <Table.Cell>
                                    <div className='flex space-x-8'>
                                        <button type='button'
                                            className='text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
                                            onClick={() => handleClickOpenEdit(item)}>
                                            Edit</button>
                                        <button type='button'
                                            className='text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
                                            onClick={() => handleClickOpen(item)}>
                                            Delete</button>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        ))}

                    </Table.Body>
                </Table>
            </div>
            <div className="flex overflow-x-auto justify-end">
                <Pagination currentPage={pageData.currentPage} totalPages={totalPages} onPageChange={handleAllPagesChange} />
            </div>
            <div className='flex items-center justify-between mt-4  '>
                <div className='flex hover:text-white space-x-6'>
                    <button type='button' className='text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' onClick={handleClickOpenDelete}>Delete</button>
                </div>
                <div>
                    <button type='button' className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
                        onClick={() => {
                            handleCreateNew();
                            handleClickOpenNew();
                        }}>
                        Add row</button>
                </div>
            </div>
            <Modal
                show={openDelete}
                onClose={handleCloseDelete}
            >
                <div className='border border-black bg-white rounded-lg gap-y-1 shadow-lg shadow-black '>
                    <div className='flex items-center justify-between  border-b rounded-t dark:border-gray-600 '>
                        <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" onClick={handleCloseDelete}>
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                    <div className='flex items-center justify-center'>
                        <div class="p-4 md:p-5 space-y-4">
                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 flex ">
                                Are you sure you want delete these items ?
                            </p>
                            <div className='text-center '>
                                {selectedRowsData.map(item => (
                                    <div key={item.id} className=" text-red-600 font-bold">
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='flex space-x-8 mt-4 justify-center mb-12  ' >
                        <div className='flex'>
                            <button type='button'
                                onClick={
                                    handleCloseDelete
                                }
                                className='text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900'
                            >
                                Disagree</button>
                        </div>
                        <button
                            onClick={deleteAll}
                            className='text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800'
                        >
                            Agree
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal
                show={open}
                onClose={handleClose}
            >
                <div className='border border-black bg-white rounded-lg gap-y-1 shadow-lg shadow-black '>
                    <div className='flex items-center justify-between  border-b rounded-t dark:border-gray-600 '>
                        <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" onClick={() => handleClose()} >
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                    <div className='flex items-center justify-center'>
                        <div class="p-4 md:p-5 space-y-4">
                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 flex " c>
                                Are you sure you want delete <p className='ml-1 text-red-600 font-bold '>{selectedRow?.name}</p>?
                            </p>
                        </div>
                    </div>
                    <div className='flex space-x-8 mt-4 justify-center mb-12  ' >
                        <div className='flex'>
                            <button type='button'
                                onClick={
                                    handleClose
                                }
                                className='text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900'
                            >
                                Disagree</button>
                        </div>
                        <button
                            onClick={() => {
                                deleteRow(selectedRow);
                                handleClose();
                            }}
                            className='text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800'
                        >
                            Agree
                        </button>
                    </div>
                </div>
            </Modal>
            {/* Modal Edit */}
            <Modal
                show={openEdit}
                onClose={handleCloseEdit}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='border border-black bg-white rounded-lg gap-y-1 shadow-lg shadow-black'>
                        <p className='flex flex-col gap-y-20 p-28' sx={{
                            width: 800,
                            maxWidth: '100%',
                        }}>
                            <div>
                                <TextInput
                                    label='Name'
                                    variant="outlined"
                                    size="large"
                                    {...register('name', { required: 'Name is required' })}
                                />
                                <p className='text-red-500'>{errors.name?.message}</p>
                            </div>
                            <div>
                                <TextInput
                                    label='Color'
                                    variant="outlined"
                                    size="large"
                                    {...register('color', { required: 'Color is required' })}
                                />
                                <p className='text-red-500'>{errors.color?.message}</p>
                            </div>
                            <div>
                                <TextInput
                                    label='Category'
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    {...register('category', { required: 'Category is required' })}
                                />
                                <p className='text-red-500'>{errors.category?.message}</p>
                            </div>
                            <div>
                                <TextInput
                                    label='Price'
                                    type='number'
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    {...register('price', {
                                        required: 'Price is required',

                                        validate: value => value > 0 || 'Price must be a positive number'
                                    })}
                                />
                                <p className='text-red-500'>{errors.price?.message}</p>
                            </div>
                        </p>
                        <div className='flex space-x-8 mt-4 justify-center mb-12'>
                            <div>
                                <button
                                    type='button'
                                    onClick={handleCloseEdit}
                                    className='text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900'>
                                    Disagree
                                </button>
                            </div>
                            <div>
                                <button
                                    type='submit'
                                    color='success'
                                    className='text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800'>
                                    Agree
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>
            <Modal
                show={openNew}
                onClose={handleCloseNew}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='border border-black bg-white rounded-lg gap-y-1 shadow-lg shadow-black '>
                        <p className='flex flex-col gap-y-20 p-28' sx={{
                            width: 800,
                            maxWidth: '100%',
                        }}>
                            <TextInput
                                label='Name'
                                variant="outlined"
                                size="large"
                                onChange={(event) => {
                                    const updatedValue = event.target.value;
                                    setAddRow((addRow) => ({
                                        ...addRow,
                                        name: updatedValue
                                    }));
                                }}
                                value={addRow ? addRow.name : ' '}
                            />
                            <TextInput
                                label='Color'
                                variant="outlined"
                                size="large"
                                onChange={(event) => {
                                    const updatedValue = event.target.value;
                                    setAddRow((addRow) => ({
                                        ...addRow,
                                        color: updatedValue
                                    }));
                                }}
                                value={addRow ? addRow.color : ''}
                            />
                            <TextInput
                                label='Category'
                                variant="outlined"
                                size="large"
                                fullWidth
                                onChange={(event) => {
                                    const updatedValue = event.target.value;
                                    setAddRow((addRow) => ({
                                        ...addRow,
                                        category: updatedValue

                                    }));

                                }}
                                value={addRow ? addRow.category : ''}
                            />
                            <TextInput
                                label='Price'
                                type='number'
                                variant="outlined"
                                size="large"
                                fullWidth
                                onChange={(event) => {
                                    const updatedValue = event.target.value;
                                    setAddRow((addRow) => ({
                                        ...addRow,
                                        price: parseInt(updatedValue, 10)
                                    }));
                                }}
                                value={addRow ? addRow.price : ''}
                            />
                        </p>
                        <div className='flex space-x-8 mt-4 justify-center mb-12  ' >
                            <div>
                                <button type='button'
                                    onClick={
                                        handleCloseNew
                                    }
                                    color='error'
                                    className='text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900'>
                                    Disagree</button>
                            </div>
                            <div>
                                <button type='button'
                                    color='success'
                                    onClick={() => {
                                        handleConfirmAddRow();
                                        handleCloseNew();
                                    }}
                                    className='text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800'
                                >
                                    Agree
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
export default Table1;