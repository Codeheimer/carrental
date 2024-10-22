'use client';

import GenericButton, { createButtonDetails } from "@/app/components/fields/genericButton";
import Textbox, { createTextboxDetails } from "@/app/components/fields/textbox";
import ImageLoader from "@/app/components/images/imageLoader";
import GenericModal, { initialModal, ModalProp } from "@/app/components/popups/genericModal";
import ImageModal, { defaultImageModalProperties, ImageModalProperties } from "@/app/components/popups/imageModal";
import AuthenticatedPage from "@/app/components/security/authenticatedPage";
import { User } from "@/app/services/adminService";
import useAuthStore from "@/app/stores/authStore";
import useGlobalServiceStore from "@/app/stores/globalServiceStore";
import { ReactNode, useEffect, useState } from "react";

export default function Accounts() {
    const [users, setUsers] = useState<User[]>([]);
    const { adminService } = useGlobalServiceStore();
    const { session } = useAuthStore();
    const [imageModal, setImageModal] = useState<ImageModalProperties>(defaultImageModalProperties);
    const [modal, setModal] = useState<ModalProp>(initialModal)


    useEffect(() => {
        const fetchUsers = async () => {
            if (session.token) {
                const response = await adminService.fetchUsers(session.token);
                if (response.success) {
                    setUsers(response.users);
                } else {
                    alert(response.message);
                }
            }
        }
        fetchUsers();
    }, [adminService, session.token]);

    const handleApprove = (id: string) => {
        if (session.token) {
            adminService.updateStatus(session.token, id, 'APPROVED')
        }

        setUsers(users.map(reg =>
            reg.id === id ? { ...reg, status: 'APPROVED' } : reg
        ));
    };

    const handleReject = (id: string) => {
        if (session.token) {
            adminService.updateStatus(session.token, id, 'DECLINED')
        }
        setUsers(users.map(reg =>
            reg.id === id ? { ...reg, status: 'DECLINED' } : reg
        ));
    };

    const handleShowImage = (imageURL: string) => {
        const newProp = { open: true, imageURL: imageURL, handleClose: handleCloseImage }
        setImageModal(newProp);
    }

    const handleCloseImage = () => {
        setImageModal(defaultImageModalProperties);
    }

    const handleToggleDeactivate = (id: string) => {
        if (session.token) {
            adminService.toggleDeactivate(session.token, id);
        }

        setUsers(users.map(reg =>
            reg.id === id ? { ...reg, deactivated: !reg.deactivated } : reg
        ));
    }

    const handleChangePasswordModal = (id: string) => {
        const newModal: ModalProp = {
            onClose: () => { setModal({ ...modal, isOpen: false }) },
            isOpen: true,
            children: changePasswordModal(id),
        };
        setModal(newModal);
    }

    const handleChangePasswordSubmit = (event: React.FormEvent, id: string) => {
        if (session.token) {
            event.preventDefault();
            const formData = new FormData(event.target as HTMLFormElement);
            const jsonData: { [key: string]: any } = {};
            formData.forEach((value, key) => {
                jsonData[key] = value;
            });

            adminService.changePassword(session.token, id, jsonData.changePassword)
        }
    }

    const changePasswordModal = (id: string): ReactNode => {
        return (<form onSubmit={(e) => handleChangePasswordSubmit(e, id)}>
            <div className="flex flex-col p-2 m-2">
                <Textbox {...createTextboxDetails("New Password", "changePassword", true, false)} />
                <GenericButton {...createButtonDetails("Submit", "submit")} />
            </div>
        </form>)
    }

    return (<AuthenticatedPage>
        <div className="flex flex-col w-full h-full justify-center items-center container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Accounts Dashboard</h1>
            <table className="h-full w-full text-center">
                <thead>
                    <tr>
                        <th className="w-1/12"></th>
                        <th className="w-1/4">Name</th>
                        <th className="w-1/4">Attachments</th>
                        <th className="w-1/4">Status</th>
                        <th className="w-1/4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr className="h-20" key={user.id}>
                            <td>
                                <div className="w-24 h-24 rounded-xl">
                                    {<ImageLoader layout={'fill'} objectFit={'contain'} src={user.profilePicture} alt={`picture`} className={`"flex flex-col m-6 xl:w-1/2 w-full rounded-xl shadow-lg overflow-hidden`} />}
                                </div>
                            </td>
                            <td>{user.name}</td>
                            <td>
                                <GenericButton {...createButtonDetails("ID", "button", () => handleShowImage(user.uploadedId))} />
                                {user.uploadedBusinessPermit && <GenericButton {...createButtonDetails("Permit", "button", () => handleShowImage(user.uploadedBusinessPermit))} />}
                            </td>
                            <td>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${user.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        user.status === 'DECLINED' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'}`}>
                                    {user.status}
                                </span>
                            </td>
                            <td>
                                {user.status === 'PENDING' && (
                                    <div className="flex justify-center items-center space-x-2">
                                        <GenericButton {...createButtonDetails("Approve", "button", () => handleApprove(user.id))} />
                                        <GenericButton {...createButtonDetails("Reject", "button", () => handleReject(user.id))} />
                                    </div>
                                )}
                                {user.status !== 'PENDING' && (
                                    <div className="flex justify-center items-center space-x-2">
                                        <GenericButton {...createButtonDetails(user.deactivated ? 'Activate' : 'Deactivate', "button", () => handleToggleDeactivate(user.id))} />
                                        <GenericButton {...createButtonDetails('Change Password', "button", () => handleChangePasswordModal(user.id))} />
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {imageModal.open && <ImageModal {...imageModal} />}
        {modal.isOpen && <GenericModal {...modal} />}
    </AuthenticatedPage>)
}