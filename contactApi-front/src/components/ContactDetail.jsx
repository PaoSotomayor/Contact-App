import React, { useRef } from 'react'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import { getContact, updatePhoto } from '../api/ContactService';
import { toastError, toastSuccess } from '../api/ToastService';

const ContactDetail = ({ updateContact, updateImage }) => {
    const inputRef = useRef();
    const [contact, setContact] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '',
        photoURL: ''
    });

    const { id } = useParams();

    const fetchContact = async (id) => {
        try {
            const { data } = await getContact(id);
            setContact(data);
            console.log(data);
            toastSuccess('Contact retrieved')
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    };

    const selectImage = () => {
        inputRef.current.click();
    };

    const updatePhoto = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('id', id);
            await updateImage(formData);
            setContact((prev) => ({ ...prev, photoURL: `${prev.photoURL}?update_at=${new Date().getTime()}` }));
            console.log('data');
            toastSuccess('Photo updated');
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    };
    const onChange = (event) => {
        setContact({ ...contact, [event.target.name]: event.target.value });

    };
    const onUpdateContact = async (event) => {
        event.preventDefault();
        await updateContact(contact);
        fetchContact(id);
        // toastSuccess('Contact Updated');

    };

    useEffect(() => {
        fetchContact(id);
    }, []);

    return (
        <>
            <Link to={'/'} className='link'><i className='bi bi-arrow-left'></i>Back to list</Link>
            <div className='profile'>
                <div className='profile__details'>
                    <img src={contact.photoURL} alt={`Profile photo of ${contact.name}`} />
                    <div className='profile__metadata'>
                        <p className='profile__muted'>JPG or PNG. Max size of 3MG</p>
                        <button onClick={selectImage} className='btn'><i className='bi bi-cloud-upload'></i>Change photo</button>
                    </div>
                </div>

                <div className='profile__settings'>
                    <div>
                        <form onSubmit={onUpdateContact} className='form'>
                            <div className="user-details">
                                <input type="hidden" defaultValue={contact.id} name="id" required />
                                <div className="input-box">
                                    <span className="details">Name</span>
                                    <input type="text" value={contact.name} onChange={onChange} name="name" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Email</span>
                                    <input type="text" value={contact.email} onChange={onChange} name="email" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Phone</span>
                                    <input type="text" value={contact.phone} onChange={onChange} name="phone" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Address</span>
                                    <input type="text" value={contact.address} onChange={onChange} name="address" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Title</span>
                                    <input type="text" value={contact.title} onChange={onChange} name='title' required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Status</span>
                                    <input type="text" value={contact.status} onChange={onChange} name="status" required />
                                </div>
                            </div>
                            <div className="form_footer">
                                <button type="submit" className="btn">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <form style={{ display: 'none' }}>
                <input type="file" ref={inputRef} onChange={(event) => updatePhoto(event.target.files[0])} name='file' accept='image/*' />
            </form>
        </>
    )
}

export default ContactDetail
