'use client';

import GenericButton, { createButtonDetails } from "@/app/components/fields/genericButton";
import ImageModal, { defaultImageModalProperties, ImageModalProperties } from "@/app/components/popups/imageModal";
import AuthenticatedPage from "@/app/components/security/authenticatedPage";
import { User } from "@/app/services/adminService";
import useAuthStore from "@/app/stores/authStore";
import useGlobalServiceStore from "@/app/stores/globalServiceStore";
import { useEffect, useState } from "react";

export default function Accounts() {
    const [users, setUsers] = useState<User[]>([]);
    const { adminService } = useGlobalServiceStore();
    const { session } = useAuthStore();
    const [imageModal, setImageModal] = useState<ImageModalProperties>(defaultImageModalProperties);


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

    return (<AuthenticatedPage>
        <div className="flex flex-col w-full h-full justify-center items-center container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Accounts Dashboard</h1>
            <table className="h-full w-full text-center">
                <thead>
                    <tr>
                        <th className="w-1/4">Name</th>
                        <th className="w-1/4">Attachments</th>
                        <th className="w-1/4">Status</th>
                        <th className="w-1/4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr className="h-20" key={user.id}>
                            <td>{user.name}</td>
                            <td>
                                <GenericButton {...createButtonDetails("ID", "button", () => handleShowImage(user.uploadedId))} />
                                <GenericButton {...createButtonDetails("Permit", "button", () => handleShowImage(user.uploadedBusinessPermit))} />
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {imageModal.open && <ImageModal {...imageModal} />}
    </AuthenticatedPage>)
}